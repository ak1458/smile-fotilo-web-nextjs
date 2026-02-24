$envFile = ".env.local"
$keys = Get-Content $envFile | ForEach-Object {
    if ($_ -match "^[A-Z0-9_]+=") {
        $parts = $_.Split('=', 2)
        return @{ Name = $parts[0].Trim(); Value = $parts[1].Trim() }
    }
}

$environments = @("production", "preview", "development")

foreach ($key in $keys) {
    if ($null -ne $key.Name -and $null -ne $key.Value -and $key.Value -ne "" -and $key.Name -notmatch "^#") {
        Write-Host "Updating $($key.Name)..."
        foreach ($env in $environments) {
            # Trim quotes if they exist around the value
            $val = $key.Value -replace '^"|"$', ''
            echo "$val" | npx vercel env add "$($key.Name)" "$env" --force
        }
    }
}

