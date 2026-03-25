@echo off
echo Starting Padidi Development Servers...
echo.

echo Stopping any previous backend instance...
taskkill /F /IM "PADIDI.API.exe" >nul 2>&1
timeout /t 1 /nobreak >nul

echo [1/3] Starting Backend API (http://localhost:5029/swagger)...
start "Padidi Backend" cmd /k "cd /d %~dp0backend\PADIDI.API && dotnet run"

timeout /t 3 /nobreak >nul

echo [2/3] Starting BO Portal (Vite dev server)...
start "Padidi BO Portal" cmd /k "cd /d %~dp0 && npm run dev:bo"

timeout /t 2 /nobreak >nul

echo [3/3] Starting User Portal (Vite dev server)...
start "Padidi User Portal" cmd /k "cd /d %~dp0 && npm run dev:user"

echo.
echo All servers launched in separate windows.
echo.
echo  URLs:
echo  - Backend API  : http://localhost:5029/swagger
echo  - BO Portal    : http://localhost:5173 (or next available port)
echo  - User Portal  : http://localhost:5174 (or next available port)
echo.
echo  Login Credentials:
echo  - BO Admin     : admin@padidi.com  /  Admin@123!
echo  - User Portal  : register a new account at /register
echo.
pause
