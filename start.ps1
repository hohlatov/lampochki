# Запуск backend (3 микросервиса) + frontend
# Использование из корня репозитория:
#   .\start.ps1
#
# Откроется 4 окна PowerShell. Закройте окна, чтобы остановить сервисы.

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$ms = Join-Path $root 'lampochki_microservices'
$fe = Join-Path $root 'lampochki-frontend'

function Start-ServiceWindow {
    param(
        [string]$Title,
        [string]$WorkDir,
        [string]$Command
    )
    $cmd = "Set-Location -LiteralPath '$WorkDir'; `$Host.UI.RawUI.WindowTitle = '$Title'; $Command"
    Start-Process powershell -ArgumentList @('-NoExit', '-Command', $cmd)
}

Write-Host ''
Write-Host 'Лампочки — запуск проекта' -ForegroundColor Cyan
Write-Host '=========================' -ForegroundColor Cyan
Write-Host ''

# Backend
Start-ServiceWindow -Title 'Auth :8002' -WorkDir (Join-Path $ms 'auth_service') `
    -Command 'pip install -q -r requirements.txt; uvicorn main:app --reload --port 8002'

Start-ServiceWindow -Title 'Products :8000' -WorkDir (Join-Path $ms 'products_service') `
    -Command 'pip install -q -r requirements.txt; uvicorn main:app --reload --port 8000'

Start-ServiceWindow -Title 'Orders :8001' -WorkDir (Join-Path $ms 'orders_service') `
    -Command 'pip install -q -r requirements.txt; uvicorn main:app --reload --port 8001'

# Frontend
if (-not (Test-Path (Join-Path $fe 'node_modules'))) {
    Write-Host 'Первый запуск: установка npm-зависимостей...' -ForegroundColor Yellow
    Start-ServiceWindow -Title 'Frontend :5173' -WorkDir $fe `
        -Command 'npm install; npm run dev'
} else {
    Start-ServiceWindow -Title 'Frontend :5173' -WorkDir $fe `
        -Command 'npm run dev'
}

Write-Host 'Запущено:' -ForegroundColor Green
Write-Host '  Auth      http://localhost:8002/docs'
Write-Host '  Products  http://localhost:8000/docs'
Write-Host '  Orders    http://localhost:8001/docs'
Write-Host '  Frontend  http://localhost:5173'
Write-Host '  Админ     http://localhost:5173/login  (admin / admin123)'
Write-Host ''
Write-Host 'Чтобы остановить — закройте все 4 окна терминала.' -ForegroundColor DarkGray
Write-Host ''
