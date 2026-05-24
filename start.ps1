# Start backend (3 microservices) + frontend
# Usage: .\start.ps1
# Opens 4 PowerShell windows. Close them to stop all services.

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$ms = Join-Path $root 'lampochki_microservices'
$fe = Join-Path $root 'lampochki-frontend'

function Start-ServiceWindow {
    param(
        [string]$Title,
        [string]$WorkDir,
        [int]$Port,
        [switch]$IsFrontend
    )

    if ($IsFrontend) {
        $inner = @"
Set-Location -LiteralPath '$WorkDir'
`$Host.UI.RawUI.WindowTitle = '$Title'
if (-not (Test-Path node_modules)) { npm install }
npm run dev
"@
    } else {
        $inner = @"
Set-Location -LiteralPath '$WorkDir'
`$Host.UI.RawUI.WindowTitle = '$Title'
python -m pip install -q -r requirements.txt
if (`$LASTEXITCODE -ne 0) { Write-Host 'pip install failed'; pause; exit 1 }
python -m uvicorn main:app --reload --port $Port
"@
    }

    Start-Process powershell.exe -ArgumentList @(
        '-NoExit',
        '-ExecutionPolicy', 'Bypass',
        '-Command',
        $inner
    )
}

Write-Host ''
Write-Host 'Lampochki - starting...' -ForegroundColor Cyan
Write-Host ''

Start-ServiceWindow -Title 'Auth :8002' -WorkDir (Join-Path $ms 'auth_service') -Port 8002
Start-Sleep -Milliseconds 400
Start-ServiceWindow -Title 'Products :8000' -WorkDir (Join-Path $ms 'products_service') -Port 8000
Start-Sleep -Milliseconds 400
Start-ServiceWindow -Title 'Orders :8001' -WorkDir (Join-Path $ms 'orders_service') -Port 8001
Start-Sleep -Milliseconds 400
Start-ServiceWindow -Title 'Frontend :5173' -WorkDir $fe -IsFrontend

Write-Host 'Started:' -ForegroundColor Green
Write-Host '  Auth      http://localhost:8002/docs'
Write-Host '  Products  http://localhost:8000/docs'
Write-Host '  Orders    http://localhost:8001/docs'
Write-Host '  Frontend  http://localhost:5173'
Write-Host '  Admin     http://localhost:5173/login  (admin / admin123)'
Write-Host ''
Write-Host 'Stop: close all 4 terminal windows.' -ForegroundColor DarkGray
Write-Host ''
