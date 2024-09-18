@echo off
echo A iniciar o runner...

rem Obtém o caminho do diretório atual onde o script está sendo executado
set "diretorio_script=%~dp0"

rem Executa npm start na pasta BackOffice em um novo processo
if exist "%diretorio_script%BackOffice" (
    start "BackOffice" cmd /c "cd /d "%diretorio_script%BackOffice" && npm install && npm run devStart"
    echo BackOffice e API iniciados
) else (
    echo Pasta BackOffice não encontrada.
)

rem Executa npm start na pasta FrontOffice em um novo processo
if exist "%diretorio_script%FrontOffice" (
    start "FrontOffice" cmd /c "cd /d "%diretorio_script%FrontOffice" && npm install && npm start"
    echo FrontOffice iniciado
) else (
    echo Pasta FrontOffice não encontrada.
)

pause
