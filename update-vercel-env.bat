@echo off
REM Vercel Environment Variables Updater
REM Run this after rotating all API keys

echo Updating Vercel Environment Variables...
echo.

REM Feature Flags
vercel env add NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION
echo 1

vercel env add NEXT_PUBLIC_DISABLE_HERO_ANIMATIONS
echo 1

REM AI Provider
vercel env add AI_PROVIDER
echo smart

REM OpenRouter (NEW KEY - paste when prompted)
vercel env add OPENROUTER_API_KEY

vercel env add OPENROUTER_MODEL
echo z-ai/glm-4.5-air:free

REM Supabase (NEW KEYS - paste when prompted)
vercel env add NEXT_PUBLIC_SUPABASE_URL
echo https://rtyftfjsdkzhbrbnsesm.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

vercel env add SUPABASE_SERVICE_ROLE_KEY

REM Twilio Voice (NEW KEYS - paste when prompted)
vercel env add TWILIO_ACCOUNT_SID

vercel env add TWILIO_AUTH_TOKEN

vercel env add TWILIO_API_KEY_SID

vercel env add TWILIO_API_KEY_SECRET

vercel env add TWILIO_PHONE_NUMBER
echo +12186633676

REM Groq (NEW KEY - paste when prompted)
vercel env add GROQ_API_KEY

vercel env add GROQ_MODEL
echo llama-3.3-70b-versatile

REM SendGrid (NEW KEY - paste when prompted)
vercel env add SENDGRID_API_KEY

REM OpenAI (NEW KEY - paste when prompted)
vercel env add OPENAI_API_KEY

vercel env add OPENAI_MODEL
echo gpt-5.2-chat-latest

vercel env add OPENAI_PAID_MODEL
echo gpt-5.2-chat-latest

REM Google Gemini (NEW KEY - paste when prompted)
vercel env add GOOGLE_GEMINI_API_KEY

vercel env add GOOGLE_GEMINI_MODEL
echo gemini-3.1-pro-preview

vercel env add GEMINI_PAID_MODEL
echo gemini-3.1-pro-preview

REM Application
vercel env add DEFAULT_BUSINESS_ID
echo a3caca28-ece6-48e2-8ccb-fa4fb63b4323

REM Security (Generate strong random strings)
vercel env add CRON_SECRET
vercel env add WHATSAPP_WEBHOOK_SECRET

REM Rate Limiting
vercel env add RATE_LIMIT_PUBLIC_API
echo 10

vercel env add RATE_LIMIT_AUTH_API
echo 30

REM Optional manual payment contact
vercel env add PAYMENT_WHATSAPP_NUMBER
echo +919453878422

REM Search Console daily automation
vercel env add SEARCH_CONSOLE_SITE_URL
echo sc-domain:smilefotilo.com

vercel env add SEARCH_CONSOLE_SITEMAP_URL
echo https://smilefotilo.com/sitemap.xml

vercel env add SEARCH_CONSOLE_AUTO_SUBMIT_SITEMAP
echo 1

vercel env add SEARCH_CONSOLE_CRITICAL_URLS
echo https://smilefotilo.com/,https://smilefotilo.com/pricing,https://smilefotilo.com/services/seo

vercel env add GOOGLE_APPLICATION_CREDENTIALS_JSON

echo.
echo All environment variables updated!
echo Now deploy: vercel --prod
pause
