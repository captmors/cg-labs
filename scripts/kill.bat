@echo off
echo Closing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo Closing Python processes...
taskkill /F /IM python.exe >nul 2>&1

echo All specified processes have been closed.
pause
