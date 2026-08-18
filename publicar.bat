@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo.
echo   ================================================
echo    Publicar Cafe en tu Casa
echo   ================================================
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo   ERROR: no encuentro git en esta computadora.
  echo   Instalalo desde https://git-scm.com/download/win
  echo.
  if "%~1"=="" pause
  exit /b 1
)

set "HAY_CAMBIOS="
for /f "delims=" %%i in ('git status --porcelain 2^>nul') do set "HAY_CAMBIOS=1"

if not defined HAY_CAMBIOS (
  echo   No hay nada nuevo para publicar.
  echo   El sitio online ya esta igual que los archivos de esta carpeta.
  echo.
  if "%~1"=="" pause
  exit /b 0
)

echo   Archivos que cambiaron:
echo.
git status --short
echo.

set "MENSAJE=%~1"
if "%MENSAJE%"=="" set /p "MENSAJE=  Que cambiaste? (Enter para omitir): "
if "%MENSAJE%"=="" set "MENSAJE=Actualizacion del sitio"

echo.
echo   Subiendo...
echo.

git add -A
if errorlevel 1 goto error

git commit -m "%MENSAJE%"
if errorlevel 1 goto error

git push
if errorlevel 1 goto error

echo.
echo   ================================================
echo    LISTO
echo.
echo    En menos de un minuto se ve en:
echo    https://cafe-en-tu-casa.vercel.app
echo.
echo    (si no lo ves, recarga con Ctrl+Shift+R)
echo   ================================================
echo.
if "%~1"=="" pause
exit /b 0

:error
echo.
echo   ================================================
echo    ALGO FALLO
echo.
echo    Copia el mensaje de error de arriba
echo    y pedile ayuda a Claude.
echo   ================================================
echo.
if "%~1"=="" pause
exit /b 1
