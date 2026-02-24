param(
  [string]$Scope = "team_mTjbTHdgrk1Xial2kB7YKqeo",
  [string]$BaseUrl = ""
)

$required = @(
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "WHATSAPP_WEBHOOK_SECRET",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "CRON_SECRET"
)

$optional = @(
  "TWILIO_PHONE_NUMBER",
  "TWILIO_WHATSAPP_FROM",
  "WHATSAPP_ACCESS_TOKEN",
  "WHATSAPP_PHONE_NUMBER_ID",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  "RAZORPAY_WEBHOOK_SECRET",
  "PAYMENT_UPI_ID",
  "NEXT_PUBLIC_PAYMENT_UPI_ID",
  "PAYMENT_PAYEE_NAME",
  "PAYMENT_WHATSAPP_NUMBER"
)

Write-Output "=== Local .env.local check ==="
$localMap = @{}
if (Test-Path ".env.local") {
  foreach ($line in Get-Content ".env.local") {
    if ($line -match "^\s*#" -or $line -match "^\s*$") { continue }
    $idx = $line.IndexOf("=")
    if ($idx -lt 1) { continue }
    $k = $line.Substring(0, $idx).Trim()
    $v = $line.Substring($idx + 1).Trim().Trim('"')
    $localMap[$k] = $v
  }
}

foreach ($name in $required) {
  $exists = $localMap.ContainsKey($name)
  $val = if ($exists) { $localMap[$name] } else { "" }
  $isPlaceholder =
    ($val -match "^your_") -or
    ($val -match "^https://your-") -or
    ($val -match "your-project-id") -or
    ($val -match "example") -or
    ($val -match "placeholder") -or
    ($val -match "changeme")
  $usable = $exists -and -not [string]::IsNullOrWhiteSpace($val) -and -not $isPlaceholder
  Write-Output ("{0,-30} {1}" -f $name, $usable)
}
Write-Output ("{0,-30} {1}" -f "TWILIO_SENDER_READY", ($localMap.ContainsKey("TWILIO_PHONE_NUMBER") -or $localMap.ContainsKey("TWILIO_WHATSAPP_FROM")))

Write-Output ""
Write-Output "=== Optional local vars (fallback works without these) ==="
foreach ($name in $optional) {
  $exists = $localMap.ContainsKey($name)
  $val = if ($exists) { $localMap[$name] } else { "" }
  $isPlaceholder =
    ($val -match "^your_") -or
    ($val -match "^https://your-") -or
    ($val -match "your-project-id") -or
    ($val -match "example") -or
    ($val -match "placeholder") -or
    ($val -match "changeme")
  $usable = $exists -and -not [string]::IsNullOrWhiteSpace($val) -and -not $isPlaceholder
  Write-Output ("{0,-30} {1}" -f $name, $usable)
}

Write-Output ""
Write-Output "=== Vercel production env check ==="
$envOutput = npx vercel env ls production --scope $Scope 2>$null
$vercelNames = New-Object System.Collections.Generic.HashSet[string]
foreach ($line in $envOutput) {
  if ($line -match "^\s*([A-Z0-9_]+)\s+Encrypted") {
    [void]$vercelNames.Add($matches[1])
  }
}

foreach ($name in $required) {
  $exists = $vercelNames.Contains($name)
  Write-Output ("{0,-30} {1}" -f $name, $exists)
}
Write-Output ("{0,-30} {1}" -f "TWILIO_SENDER_READY", ($vercelNames.Contains("TWILIO_PHONE_NUMBER") -or $vercelNames.Contains("TWILIO_WHATSAPP_FROM")))

Write-Output ""
Write-Output "=== Optional Vercel production vars (fallback works without these) ==="
foreach ($name in $optional) {
  $exists = $vercelNames.Contains($name)
  Write-Output ("{0,-30} {1}" -f $name, $exists)
}
if ([string]::IsNullOrWhiteSpace($BaseUrl)) {
  Write-Output ""
  Write-Output "Skip endpoint checks. Pass -BaseUrl https://your-domain"
  exit 0
}

Write-Output ""
Write-Output "=== Endpoint smoke checks ==="

function Check-Endpoint {
  param([string]$Url, [string]$Method = "GET", [hashtable]$Headers = @{}, [string]$Body = "")
  try {
    if ($Method -eq "POST") {
      $resp = Invoke-WebRequest -Uri $Url -Method Post -Headers $Headers -Body $Body -ContentType "application/json" -UseBasicParsing
    } else {
      $resp = Invoke-WebRequest -Uri $Url -Method Get -Headers $Headers -UseBasicParsing
    }
    return $resp.StatusCode
  } catch {
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
      return [int]$_.Exception.Response.StatusCode
    }
    return 0
  }
}

$health = Check-Endpoint -Url "$BaseUrl/api/health"
$cron = Check-Endpoint -Url "$BaseUrl/api/cron/reminders"
$waVerify = Check-Endpoint -Url "$BaseUrl/api/whatsapp/webhook"
$billingAuth = Check-Endpoint -Url "$BaseUrl/api/billing/razorpay" -Method "POST" -Body '{"action":"create_order","amountInr":1}'

Write-Output ("{0,-35} {1}" -f "/api/health", $health)
Write-Output ("{0,-35} {1}" -f "/api/cron/reminders (expect 401)", $cron)
Write-Output ("{0,-35} {1}" -f "/api/whatsapp/webhook GET (expect 403)", $waVerify)
Write-Output ("{0,-35} {1}" -f "/api/billing/razorpay POST (expect 401)", $billingAuth)
