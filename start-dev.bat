@echo off
echo ========================================
echo   Démarrage Sama Papier - Développement
echo ========================================
echo.

echo [1/3] Installation des dépendances Angular...
call npm install
if %errorlevel% neq 0 (
    echo Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo.
echo [2/3] Démarrage du backend Spring Boot...
echo Assurez-vous que votre backend Spring Boot est démarré sur le port 8080
echo Appuyez sur une touche quand le backend est prêt...
pause

echo.
echo [3/3] Démarrage du frontend Angular...
echo Le frontend sera accessible sur http://localhost:4200
echo.
call npm start

pause
