@echo off
echo Limpando porta 3020, caso esteja em uso...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :3020') DO (
  taskkill /F /PID %%T >nul 2>&1
)
echo Iniciando PsicoApp na Porta 3020...
cd /d "%~dp0"
echo Abrindo o browser automaticamente...
start http://localhost:3020
npx next dev --webpack -p 3020
pause
