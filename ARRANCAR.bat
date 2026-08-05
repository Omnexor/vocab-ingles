@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title Vocab - ingles cada dia

echo.
echo   ============================================
echo     Vocab - ingles cada dia
echo   ============================================
echo.

REM --- 1. Comprobar que Node esta instalado -------------------------------
where node >nul 2>nul
if errorlevel 1 (
  echo   [X] Node.js no esta instalado.
  echo.
  echo   Te abro la pagina de descarga. Instalalo, cierra esta
  echo   ventana y vuelve a hacer doble clic en ARRANCAR.bat
  echo.
  start "" https://nodejs.org/es/download
  pause
  exit /b 1
)

REM --- 2. Instalar dependencias la primera vez ----------------------------
if not exist "node_modules" (
  echo   Primera vez: instalando dependencias...
  echo   Esto tarda un minuto, solo pasa una vez.
  echo.
  call npm install --no-fund --no-audit
  if errorlevel 1 (
    echo.
    echo   [X] Fallo la instalacion. Revisa tu conexion a internet.
    pause
    exit /b 1
  )
  echo.
)

REM --- 3. Avisar si no hay API key ----------------------------------------
if not exist ".env.local" (
  echo   [!] No hay archivo .env.local
  echo       La app arranca igual, con la lista local de 57 palabras.
  echo       Para palabras nuevas con IA: copia .env.example a .env.local
  echo       y pon dentro tu ANTHROPIC_API_KEY
  echo.
)

REM --- 4. Abrir el navegador cuando el servidor este listo ----------------
start "" cmd /c "timeout /t 3 /nobreak >nul & start "" http://localhost:3000"

REM --- 5. Arrancar -------------------------------------------------------
node dev-server.mjs

REM Si llegamos aqui es que el servidor se ha cerrado o ha fallado.
echo.
echo   El servidor se ha detenido.
pause
