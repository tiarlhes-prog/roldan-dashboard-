@echo off
rem Guardioes do Sabado - roda o jogo COM login no seu computador, so para TESTAR (nao e a publicacao).
rem Precisa do Node.js 22 ou mais novo (https://nodejs.org). Dois cliques neste arquivo.
cd /d "%~dp0server"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Falta instalar o Node.js. Baixe a versao LTS em https://nodejs.org e de dois cliques neste arquivo de novo.
  echo.
  pause
  exit /b 1
)

for /f "tokens=1 delims=v." %%a in ('node -v') do set NODEMAJOR=%%a
if %NODEMAJOR% LSS 22 (
  echo.
  echo O Node.js instalado e antigo (versao %NODEMAJOR%). Instale a versao LTS mais nova em https://nodejs.org e tente de novo.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando as dependencias - so na primeira vez, pode levar 1 ou 2 minutos...
  call npm ci --omit=dev
  if errorlevel 1 (
    echo.
    echo A instalacao falhou. Confira a internet e tente de novo. Se persistir, me envie um print desta janela.
    echo.
    pause
    exit /b 1
  )
)

set GS_COOKIE_SECURE=0
if "%GS_ADMIN_PASSWORD%"=="" set GS_ADMIN_PASSWORD=teste-local-123456
set PORT=3000

echo.
echo ======================================================
echo  Guardioes do Sabado rodando no seu computador
echo  Endereco:  http://localhost:3000
echo  Lider:     Lider   /   senha de teste: teste-local-123456
echo  Para parar: feche esta janela.
echo ======================================================
echo.
start "" http://localhost:3000
node src/server.js
pause
