# TaskFlow DevServer - Inicia Backend + Frontend em Paralelo

Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   TaskFlow Development Server Starter  ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Obter diretório base
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Inicia Backend em nova janela
Write-Host "🚀 Iniciando Backend (Spring Boot)..." -ForegroundColor Blue
Write-Host ""

$backendCmd = @"
`$env:SPRING_PROFILES_ACTIVE='local'
cd '$scriptDir'
mvn spring-boot:run
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

# Aguarda um pouco para o backend iniciar
Write-Host "⏳ Aguardando Backend iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Inicia Frontend em nova janela
Write-Host "🚀 Iniciando Frontend (React + Vite)..." -ForegroundColor Blue
Write-Host ""

$frontendCmd = @"
cd '$scriptDir\frontend'
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ Servidores iniciados com sucesso!  ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Acesso rápido:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor Yellow
Write-Host "   Backend:   http://localhost:8080" -ForegroundColor Yellow
Write-Host "   API:       http://localhost:8080/api" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Credenciais de teste:" -ForegroundColor Cyan
Write-Host "   Email:     admin@vedata-workhub.com" -ForegroundColor Yellow
Write-Host "   Senha:     admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏹️  Para parar os servidores, feche as janelas do PowerShell" -ForegroundColor Gray
Write-Host ""

# Agora o script principal pode ser fechado ou deixado aberto
Write-Host "Aguardando..." -ForegroundColor Gray
