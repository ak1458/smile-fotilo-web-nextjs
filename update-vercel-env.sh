#!/bin/bash
# Vercel Environment Variables Updater
# Run this after rotating all API keys

echo "Updating Vercel Environment Variables..."
echo ""

# Feature Flags
vercel env add NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION <<< "1"
vercel env add NEXT_PUBLIC_DISABLE_HERO_ANIMATIONS <<< "1"

# AI Provider
vercel env add AI_PROVIDER <<< "smart"

# OpenRouter (NEW KEY - paste when prompted)
echo "Enter NEW OpenRouter API Key:"
vercel env add OPENROUTER_API_KEY

vercel env add OPENROUTER_MODEL <<< "z-ai/glm-4.5-air:free"

# Supabase (NEW KEYS - paste when prompted)
vercel env add NEXT_PUBLIC_SUPABASE_URL <<< "https://rtyftfjsdkzhbrbnsesm.supabase.co"

echo "Enter NEW Supabase Anon Key:"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

echo "Enter NEW Supabase Service Role Key:"
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Twilio Voice (NEW KEYS - paste when prompted)
echo "Enter NEW Twilio Account SID:"
vercel env add TWILIO_ACCOUNT_SID

echo "Enter NEW Twilio Auth Token:"
vercel env add TWILIO_AUTH_TOKEN

echo "Enter NEW Twilio API Key SID:"
vercel env add TWILIO_API_KEY_SID

echo "Enter NEW Twilio API Key Secret:"
vercel env add TWILIO_API_KEY_SECRET

vercel env add TWILIO_PHONE_NUMBER <<< "+12186633676"

# Groq (NEW KEY - paste when prompted)
echo "Enter NEW Groq API Key:"
vercel env add GROQ_API_KEY

vercel env add GROQ_MODEL <<< "llama-3.3-70b-versatile"

# SendGrid (NEW KEY - paste when prompted)
echo "Enter NEW SendGrid API Key:"
vercel env add SENDGRID_API_KEY

# OpenAI (NEW KEY - paste when prompted)
echo "Enter NEW OpenAI API Key:"
vercel env add OPENAI_API_KEY

vercel env add OPENAI_MODEL <<< "gpt-5.2-chat-latest"
vercel env add OPENAI_PAID_MODEL <<< "gpt-5.2-chat-latest"

# Google Gemini (NEW KEY - paste when prompted)
echo "Enter NEW Google Gemini API Key:"
vercel env add GOOGLE_GEMINI_API_KEY

vercel env add GOOGLE_GEMINI_MODEL <<< "gemini-3.1-pro-preview"
vercel env add GEMINI_PAID_MODEL <<< "gemini-3.1-pro-preview"

# Application
vercel env add DEFAULT_BUSINESS_ID <<< "a3caca28-ece6-48e2-8ccb-fa4fb63b4323"

# Security - Generate strong random strings
CRON_SECRET=$(openssl rand -base64 32)
WHATSAPP_WEBHOOK_SECRET=$(openssl rand -base64 32)

vercel env add CRON_SECRET <<< "$CRON_SECRET"
vercel env add WHATSAPP_WEBHOOK_SECRET <<< "$WHATSAPP_WEBHOOK_SECRET"

# Rate Limiting
vercel env add RATE_LIMIT_PUBLIC_API <<< "10"
vercel env add RATE_LIMIT_AUTH_API <<< "30"

# Optional manual payment contact
vercel env add PAYMENT_WHATSAPP_NUMBER <<< "+919453878422"

# Search Console daily automation
vercel env add SEARCH_CONSOLE_SITE_URL <<< "sc-domain:smilefotilo.com"
vercel env add SEARCH_CONSOLE_SITEMAP_URL <<< "https://smilefotilo.com/sitemap.xml"
vercel env add SEARCH_CONSOLE_AUTO_SUBMIT_SITEMAP <<< "1"
vercel env add SEARCH_CONSOLE_CRITICAL_URLS <<< "https://smilefotilo.com/,https://smilefotilo.com/pricing,https://smilefotilo.com/services/seo"

echo "Enter Google service account JSON in one line:"
vercel env add GOOGLE_APPLICATION_CREDENTIALS_JSON

echo ""
echo "All environment variables updated!"
echo "Now deploy: vercel --prod"
