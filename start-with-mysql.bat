@echo off
echo ========================================
echo   Sama Papier - Démarrage avec MySQL
echo ========================================
echo.

echo [1/5] Vérification de MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: MySQL n'est pas installé ou pas dans le PATH
    echo Veuillez installer MySQL et l'ajouter au PATH
    pause
    exit /b 1
)
echo ✓ MySQL détecté

echo.
echo [2/5] Test de connexion MySQL...
mysql -u root -p -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Impossible de se connecter à MySQL
    echo Vérifiez que MySQL est démarré et que le mot de passe est correct
    pause
    exit /b 1
)
echo ✓ Connexion MySQL réussie

echo.
echo [3/5] Vérification de la base de données docufind...
mysql -u root -p -e "USE docufind; SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo La base de données docufind n'existe pas
    echo Création de la base de données...
    mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS docufind CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    if %errorlevel% neq 0 (
        echo ERREUR: Impossible de créer la base de données
        pause
        exit /b 1
    )
    echo ✓ Base de données docufind créée
) else (
    echo ✓ Base de données docufind trouvée
)

echo.
echo [4/5] Initialisation de la base de données...
if exist database-init.sql (
    echo Exécution du script d'initialisation...
    mysql -u root -p docufind < database-init.sql
    if %errorlevel% neq 0 (
        echo ERREUR: Impossible d'exécuter le script d'initialisation
        pause
        exit /b 1
    )
    echo ✓ Base de données initialisée
) else (
    echo ATTENTION: Fichier database-init.sql non trouvé
    echo La base de données ne sera pas initialisée
)

echo.
echo [5/5] Test de la configuration...
if exist test-mysql-connection.sql (
    echo Exécution des tests de connexion...
    mysql -u root -p docufind < test-mysql-connection.sql
    if %errorlevel% neq 0 (
        echo ATTENTION: Certains tests ont échoué
    ) else (
        echo ✓ Tous les tests de connexion ont réussi
    )
) else (
    echo ATTENTION: Fichier test-mysql-connection.sql non trouvé
)

echo.
echo ========================================
echo   Configuration MySQL terminée !
echo ========================================
echo.
echo Prochaines étapes :
echo 1. Démarrez votre application Spring Boot
echo 2. Vérifiez que l'application se connecte à la base de données
echo 3. Démarrez l'application Angular avec : npm start
echo.
echo Base de données : docufind
echo Utilisateur admin : admin@sama-papier.com
echo.
pause



