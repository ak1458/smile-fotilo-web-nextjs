import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai/smart-router';
import { rateLimitMiddleware, rateLimits } from '@/app/lib/security/rate-limit';
import { guardPromptInput } from '@/app/lib/security/prompt-guard';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = await rateLimitMiddleware(request, rateLimits.publicApi);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const body = await request.json() as { 
      text?: string; 
      documentType?: string; 
      language?: string;
      analysisType?: 'summary' | 'extraction' | 'all';
    };
    
    const text = body.text?.trim();
    const documentType = body.documentType || 'general';
    const language = body.language || 'English';
    const analysisType = body.analysisType || 'all';

    if (!text) {
      return NextResponse.json(
        { error: 'Document text is required' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    // Guard against prompt injection and limit text length
    const textGuard = guardPromptInput(text, { maxLength: 5000 });
    if (!textGuard.safe) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400, headers: rateLimit.headers }
      );
    }

    const truncatedText = textGuard.sanitized.slice(0, 4000);

    let summary = '';
    let keyFields: Record<string, string> = {};
    let actionItems: string[] = [];

    // Generate summary
    if (analysisType === 'summary' || analysisType === 'all') {
      const summaryPrompt = `Summarize the following ${documentType} document in 2-3 sentences in ${language}:

${truncatedText}

Provide a concise summary that captures the main points.`;

      try {
        summary = await generateAIResponse(summaryPrompt, { 
          complexity: 'medium', 
          maxTokens: 200,
          temperature: 0.3 
        });
      } catch {
        summary = 'Unable to generate summary. Please check the document content.';
      }
    }

    // Extract key fields
    if (analysisType === 'extraction' || analysisType === 'all') {
      let extractionPrompt = '';
      
      if (documentType === 'invoice') {
        extractionPrompt = `Extract the following from this invoice and return as JSON-like key:value pairs:
- Invoice Number
- Date
- Vendor/Company Name
- Total Amount
- Due Date
- Payment Terms

Document: ${truncatedText}`;
      } else if (documentType === 'prescription') {
        extractionPrompt = `Extract the following from this prescription and return as JSON-like key:value pairs:
- Patient Name
- Doctor Name
- Medications
- Dosage Instructions
- Date

Document: ${truncatedText}`;
      } else if (documentType === 'contract') {
        extractionPrompt = `Extract the following from this contract and return as JSON-like key:value pairs:
- Parties Involved
- Contract Date
- Key Terms
- Expiration/End Date
- Payment Terms

Document: ${truncatedText}`;
      } else {
        extractionPrompt = `Extract the following key information from this document and return as JSON-like key:value pairs:
- Main Subject/Topic
- Key Dates
- Important Names
- Key Numbers/Amounts
- Main Purpose

Document: ${truncatedText}`;
      }

      try {
        const extractionResult = await generateAIResponse(extractionPrompt, { 
          complexity: 'medium', 
          maxTokens: 300,
          temperature: 0.2 
        });

        // Parse key:value pairs
        const lines = extractionResult.split('\n');
        for (const line of lines) {
          const match = line.match(/^[-\s]*([^:]+):\s*(.+)$/);
          if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            if (key && value && value !== 'N/A' && value !== 'Not found') {
              keyFields[key] = value;
            }
          }
        }
      } catch {
        keyFields = { note: 'Field extraction failed. Please review document manually.' };
      }
    }

    // Generate action items
    if (analysisType === 'all') {
      const actionPrompt = `Based on this ${documentType} document, list 3-5 specific action items or next steps. Return as a numbered list.

Document: ${truncatedText}`;

      try {
        const actionResult = await generateAIResponse(actionPrompt, { 
          complexity: 'medium', 
          maxTokens: 250,
          temperature: 0.4 
        });

        actionItems = actionResult
          .split('\n')
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(line => line.length > 0 && line.length < 200)
          .slice(0, 5);
      } catch {
        actionItems = ['Review the document carefully', 'Identify key stakeholders', 'Determine next steps based on content'];
      }
    }

    // If no fields were extracted, add a note
    if (Object.keys(keyFields).length === 0) {
      keyFields = { note: 'No specific fields detected. Document may be unstructured.' };
    }

    // If no action items, add defaults
    if (actionItems.length === 0) {
      actionItems = ['Review document for important details', 'Archive for future reference'];
    }

    return NextResponse.json(
      {
        summary: summary || 'Summary not requested or unavailable',
        keyFields,
        actionItems,
        documentType,
        language,
        textLength: truncatedText.length,
        success: true,
      },
      { headers: rateLimit.headers }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Document analysis failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
