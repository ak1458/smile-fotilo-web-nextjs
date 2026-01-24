'use client';

import { jsPDF } from 'jspdf';

interface ProjectData {
    name?: string;
    email?: string;
    purpose?: string;
    budget?: string;
    timeline?: string;
    features?: string;
    projectType?: string;
}

export function generateProjectPDF(data: ProjectData): void {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 0;

    // ========== HEADER SECTION ==========
    // Header background
    doc.setFillColor(99, 102, 241); // Indigo
    doc.rect(0, 0, pageWidth, 55, 'F');

    // Accent band
    doc.setFillColor(79, 70, 229); // Darker indigo
    doc.rect(0, 45, pageWidth, 10, 'F');

    // Company Logo/Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('SMILE FOTILO', margin, 25);

    // Tagline
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Digital Agency', margin, 33);

    // Document Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECT INQUIRY SUMMARY', margin, 48);

    // Date on right
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    doc.text(today, pageWidth - margin, 25, { align: 'right' });

    // Reference number
    const refNum = `REF: SF-${Date.now().toString(36).toUpperCase()}`;
    doc.text(refNum, pageWidth - margin, 33, { align: 'right' });

    y = 70;

    // ========== CLIENT INFO SECTION ==========
    doc.setTextColor(15, 23, 42); // Dark
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT INFORMATION', margin, y);

    y += 3;
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + 50, y);
    y += 10;

    // Client details in a box
    doc.setFillColor(248, 250, 252); // Light bg
    doc.roundedRect(margin, y - 5, contentWidth, 30, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    doc.setFont('helvetica', 'bold');
    doc.text('Name:', margin + 5, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(data.name || 'Not provided', margin + 25, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.text('Email:', margin + 5, y + 15);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(99, 102, 241);
    doc.text(data.email || 'Not provided', margin + 25, y + 15);

    y += 40;

    // ========== PROJECT DETAILS SECTION ==========
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECT DETAILS', margin, y);

    y += 3;
    doc.setDrawColor(99, 102, 241);
    doc.line(margin, y, margin + 45, y);
    y += 10;

    // Project details cards
    const details = [
        { label: 'Project Type', value: data.projectType || data.purpose || 'Website' },
        { label: 'Purpose/Description', value: data.features || data.purpose || 'General inquiry' },
        { label: 'Timeline', value: data.timeline || 'To be discussed' },
        { label: 'Budget Range', value: data.budget || 'To be discussed' }
    ];

    details.forEach((item, index) => {
        const cardY = y + (index * 22);

        // Card background
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, cardY, contentWidth, 18, 2, 2, 'F');

        // Left accent bar
        doc.setFillColor(99, 102, 241);
        doc.rect(margin, cardY, 3, 18, 'F');

        // Label
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text(item.label.toUpperCase(), margin + 8, cardY + 6);

        // Value
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        const displayValue = item.value.length > 60 ? item.value.substring(0, 57) + '...' : item.value;
        doc.text(displayValue, margin + 8, cardY + 13);
    });

    y += (details.length * 22) + 15;

    // ========== NEXT STEPS SECTION ==========
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('WHAT HAPPENS NEXT?', margin, y);

    y += 3;
    doc.setDrawColor(6, 182, 212); // Cyan
    doc.line(margin, y, margin + 55, y);
    y += 10;

    // Steps with numbered circles
    const steps = [
        'Our team will review your requirements within 24 hours',
        'You\'ll receive a detailed proposal with pricing & timeline',
        'Schedule a call to discuss and finalize the scope',
        'Once approved, we begin crafting your digital presence!'
    ];

    steps.forEach((step, index) => {
        // Circle number
        doc.setFillColor(99, 102, 241);
        doc.circle(margin + 4, y + 2, 4, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}`, margin + 2.5, y + 4.5);

        // Step text
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(step, margin + 15, y + 4);

        y += 12;
    });

    y += 10;

    // ========== CONTACT BOX ==========
    doc.setFillColor(15, 23, 42); // Dark bg
    doc.roundedRect(margin, y, contentWidth, 35, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Ready to start? Get in touch!', margin + 10, y + 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text('+91 9453878422', margin + 10, y + 22);
    doc.text('ashrafkamal1458@gmail.com', margin + 70, y + 22);
    doc.text('smilefotilo.com', margin + 10, y + 30);

    // ========== FOOTER ==========
    const footerY = pageHeight - 15;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Generated by Echo AI Assistant | smilefotilo.com', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Page 1 of 1', pageWidth - margin, footerY, { align: 'right' });

    // Save the PDF
    const fileName = `SmileFotilo_Inquiry_${data.name?.replace(/\s+/g, '_') || 'Project'}_${Date.now()}.pdf`;
    doc.save(fileName);
}

// Export a function to generate and download
export function downloadProjectSummary(data: ProjectData): void {
    try {
        generateProjectPDF(data);
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Failed to generate PDF. Please try again.');
    }
}
