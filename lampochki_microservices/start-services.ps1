# Backend only. Full stack: ..\start.ps1

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

function Start-ServiceWindow {
    param([string]$Title, [string]$WorkDir, [int]$Port)
    $inner = @"
Set-Location -LiteralPath '$WorkDir'
`$Host.UI.RawUI.WindowTitle = '$Title'
python -m pip install -q -r requirements.txt
python -m uvicorn main:app --reload --port $Port
"@
    Start-Process powershell.exe -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $inner
}

Start-ServiceWindow -Title 'Auth :8002' -WorkDir (Join-Path $root 'auth_service') -Port 8002
Start-ServiceWindow -Title 'Products :8000' -WorkDir (Join-Path $root 'products_service') -Port 8000
Start-ServiceWindow -Title 'Orders :8001' -WorkDir (Join-Path $root 'orders_service') -Port 8001

Write-Host 'Backend started on ports 8002, 8000, 8001'
