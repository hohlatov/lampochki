# Только backend. Полный запуск (backend + frontend): ..\start.ps1

$root = $PSScriptRoot

function Start-ServiceWindow {
    param([string]$Title, [string]$WorkDir, [string]$Command)
    $cmd = "Set-Location -LiteralPath '$WorkDir'; `$Host.UI.RawUI.WindowTitle = '$Title'; $Command"
    Start-Process powershell -ArgumentList @('-NoExit', '-Command', $cmd)
}

Start-ServiceWindow -Title 'Auth :8002' -WorkDir (Join-Path $root 'auth_service') `
    -Command 'pip install -q -r requirements.txt; uvicorn main:app --reload --port 8002'
Start-ServiceWindow -Title 'Products :8000' -WorkDir (Join-Path $root 'products_service') `
    -Command 'pip install -q -r requirements.txt; uvicorn main:app --reload --port 8000'
Start-ServiceWindow -Title 'Orders :8001' -WorkDir (Join-Path $root 'orders_service') `
    -Command 'pip install -q -r requirements.txt; uvicorn main:app --reload --port 8001'

Write-Host 'Backend: :8002, :8000, :8001. Frontend: ..\start.ps1'
