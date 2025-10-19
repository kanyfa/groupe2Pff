# Configuration MySQL pour Sama Papier

Ce guide vous explique comment configurer et connecter votre base de données MySQL "docufind" à votre application Spring Boot.

## 🗄️ Prérequis

- MySQL Server installé et en cours d'exécution
- Base de données "docufind" créée
- Utilisateur MySQL avec les permissions appropriées

## 🚀 Configuration Rapide

### 1. Vérification de MySQL

```bash
# Vérifier que MySQL est en cours d'exécution
mysql --version

# Se connecter à MySQL
mysql -u root -p
```

### 2. Création de la base de données

```sql
-- Se connecter à MySQL en tant que root
mysql -u root -p

-- Créer la base de données
CREATE DATABASE docufind CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Vérifier la création
SHOW DATABASES;

-- Utiliser la base de données
USE docufind;
```

### 3. Exécution du script d'initialisation

```bash
# Exécuter le script SQL
mysql -u root -p docufind < database-init.sql
```

## 🔧 Configuration Spring Boot

### Fichier application.properties

Le fichier `application.properties` est déjà configuré avec :

```properties
# Configuration MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/docufind?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=nani
```

### Dépendances Maven

Assurez-vous que votre `pom.xml` contient :

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>
```

## 🔐 Configuration des Utilisateurs MySQL

### Création d'un utilisateur dédié (Recommandé)

```sql
-- Créer un utilisateur dédié pour l'application
CREATE USER 'sama_papier'@'localhost' IDENTIFIED BY 'sama_papier_password';

-- Accorder tous les privilèges sur la base docufind
GRANT ALL PRIVILEGES ON docufind.* TO 'sama_papier'@'localhost';

-- Appliquer les changements
FLUSH PRIVILEGES;

-- Vérifier les permissions
SHOW GRANTS FOR 'sama_papier'@'localhost';
```

### Mise à jour de la configuration

Si vous utilisez un utilisateur dédié, mettez à jour `application.properties` :

```properties
spring.datasource.username=sama_papier
spring.datasource.password=sama_papier_password
```

## 🚀 Démarrage de l'Application

### 1. Démarrer MySQL

```bash
# Windows
net start mysql

# Linux/Mac
sudo systemctl start mysql
# ou
sudo service mysql start
```

### 2. Vérifier la connexion

```bash
# Tester la connexion
mysql -u root -p -e "SELECT 1"
```

### 3. Démarrer Spring Boot

```bash
# Dans le répertoire de votre projet Spring Boot
mvn spring-boot:run
```

## 🔍 Vérification de la Connexion

### 1. Vérifier les logs Spring Boot

Recherchez dans les logs :
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

### 2. Tester la connexion via l'application

L'application devrait démarrer sans erreur de connexion à la base de données.

### 3. Vérifier les tables créées

```sql
-- Se connecter à la base
mysql -u root -p docufind

-- Lister les tables
SHOW TABLES;

-- Vérifier la structure d'une table
DESCRIBE users;
```

## 🛠️ Dépannage

### Problème : "Access denied for user 'root'@'localhost'"

**Solution :**
```sql
-- Réinitialiser le mot de passe root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nouveau_mot_de_passe';
FLUSH PRIVILEGES;
```

### Problème : "Unknown database 'docufind'"

**Solution :**
```sql
-- Créer la base de données
CREATE DATABASE docufind CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Problème : "Connection refused"

**Solutions :**
1. Vérifier que MySQL est démarré
2. Vérifier le port (3306 par défaut)
3. Vérifier la configuration de connexion

### Problème : "SSL connection error"

**Solution :** Ajouter `useSSL=false` à l'URL de connexion :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/docufind?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

## 📊 Structure de la Base de Données

### Tables Principales

- `users` - Utilisateurs de l'application
- `announcements` - Annonces de documents perdus
- `messages` - Messages entre utilisateurs
- `notifications` - Notifications système
- `document_types` - Types de documents
- `matches` - Correspondances trouvées
- `favorites` - Favoris des utilisateurs
- `reports` - Signalements

### Utilisateur Admin par Défaut

- **Username :** admin
- **Email :** admin@sama-papier.com
- **Password :** (hashé dans la base)
- **Role :** ADMIN

## 🔒 Sécurité

### Recommandations

1. **Changez le mot de passe par défaut** de l'utilisateur admin
2. **Utilisez un utilisateur dédié** pour l'application
3. **Limitez les permissions** au strict nécessaire
4. **Activez SSL** en production
5. **Sauvegardez régulièrement** la base de données

### Sauvegarde

```bash
# Sauvegarde complète
mysqldump -u root -p docufind > backup_docufind_$(date +%Y%m%d).sql

# Restauration
mysql -u root -p docufind < backup_docufind_20231201.sql
```

## 📈 Monitoring

### Vérifier les connexions actives

```sql
-- Voir les connexions actives
SHOW PROCESSLIST;

-- Voir les statistiques
SHOW STATUS LIKE 'Connections';
SHOW STATUS LIKE 'Threads_connected';
```

### Logs MySQL

```bash
# Voir les logs d'erreur
tail -f /var/log/mysql/error.log

# Voir les logs généraux
tail -f /var/log/mysql/mysql.log
```

## ✅ Checklist de Configuration

- [ ] MySQL installé et démarré
- [ ] Base de données "docufind" créée
- [ ] Script d'initialisation exécuté
- [ ] Utilisateur MySQL configuré
- [ ] application.properties configuré
- [ ] Dépendances Maven ajoutées
- [ ] Application Spring Boot démarre sans erreur
- [ ] Tables créées dans la base
- [ ] Utilisateur admin créé

## 🆘 Support

En cas de problème :

1. Vérifiez les logs Spring Boot
2. Vérifiez les logs MySQL
3. Testez la connexion manuellement
4. Vérifiez la configuration réseau
5. Consultez la documentation MySQL

## 📚 Ressources Utiles

- [Documentation MySQL](https://dev.mysql.com/doc/)
- [Spring Boot Data Access](https://spring.io/guides/gs/accessing-data-mysql/)
- [Hibernate Documentation](https://hibernate.org/orm/documentation/)
- [MySQL Connector/J](https://dev.mysql.com/doc/connector-j/8.0/en/)
