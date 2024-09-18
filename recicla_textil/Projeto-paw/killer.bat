@echo off
echo A encerrar os servidores...

rem Encerra os processos do Node.js
taskkill /f /im node.exe /t
echo Processos do Node.js encerrados.

pause
