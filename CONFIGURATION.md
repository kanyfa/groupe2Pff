# Configuration Sama Papier - Angular + Spring Boot

Ce document explique comment configurer et associer votre application Angular avec votre backend Spring Boot.

## 🚀 Configuration Rapide

### 1. Démarrage du Backend Spring Boot

```bash
# Dans le répertoire de votre projet Spring Boot
mvn spring-boot:run
# ou
./mvnw spring-boot:run
```

Le backend sera accessible sur `http://localhost:8080`

### 2. Démarrage du Frontend Angular

```bash
# Dans le répertoire Angular
npm install
npm start
```

Le frontend sera accessible sur `http://localhost:4200`

## 📁 Structure de Configuration

### Environnements Angular

- `src/environments/environment.ts` - Configuration de développement
- `src/environments/environment.prod.ts` - Configuration de production
- `src/environments/environment.local.ts` - Configuration locale

### Services de Configuration

- `src/app/services/config.service.ts` - Service centralisé pour la configuration
- `src/app/constants/app.constants.ts` - Constantes de l'application

### Proxy de Développement

- `proxy.conf.json` - Configuration du proxy pour le développement
- `angular.json` - Configuration Angular CLI

## 🔧 Configuration des Environnements

### Développement (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'Sama Papier',
  // ... autres configurations
};
```

### Production (environment.prod.ts)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api-url.com/api',
  appName: 'Sama Papier',
  // ... autres configurations
};
```

## 🌐 Configuration CORS

Votre configuration Spring Boot inclut déjà les paramètres CORS :

```properties
app.cors.allowed-origins=http://localhost:4200,http://localhost:3000
app.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
app.cors.allowed-headers=*
app.cors.allow-credentials=true
```

## 🔐 Configuration JWT

### Backend Spring Boot
```properties
app.jwt.secret=samaPapierSecretKey123456789012345678901234567890
app.jwt.expiration=86400000
```

### Frontend Angular
Le token JWT est automatiquement ajouté aux requêtes via l'intercepteur `AuthInterceptor`.

## 📧 Configuration Email

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-sama-papier-email@gmail.com
spring.mail.password=your-sama-papier-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

## 🗄️ Configuration Base de Données

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/docufind
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=root
spring.datasource.password=nani
spring.h2.console.enabled=true
```

## 📁 Configuration Upload de Fichiers

```properties
app.upload.dir=uploads/
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

## 🔍 Configuration OAuth2

```properties
spring.security.oauth2.client.registration.google.client-id=your-sama-papier-google-client-id
spring.security.oauth2.client.registration.google.client-secret=your-sama-papier-google-client-secret
spring.security.oauth2.client.registration.google.scope=email,profile
```

## 🚀 Scripts de Démarrage

### Développement avec Proxy
```bash
npm start
```

### Développement sans Proxy
```bash
npm run start:no-proxy
```

### Production
```bash
npm run build:prod
npm run serve:prod
```

## 🔧 Utilisation du ConfigService

```typescript
import { ConfigService } from './services/config.service';

constructor(private configService: ConfigService) {}

// Obtenir l'URL de l'API
const apiUrl = this.configService.getApiUrl();

// Obtenir la configuration JWT
const jwtSecret = this.configService.getJwtSecret();

// Obtenir la configuration email
const emailConfig = this.configService.getEmailConfig();
```

## 📊 Monitoring et Logs

### Backend Spring Boot
```properties
logging.level.com.documents.lostdocumentsapp=DEBUG
logging.level.org.springframework.security=DEBUG
```

### Frontend Angular
Les logs sont configurés dans `environment.ts` :
```typescript
debug: true,
logLevel: 'DEBUG',
enableApiLogging: true
```

## 🛠️ Dépannage

### Problèmes CORS
1. Vérifiez que les origines sont correctement configurées
2. Assurez-vous que `allowCredentials` est configuré
3. Vérifiez les headers autorisés

### Problèmes de Proxy
1. Vérifiez que `proxy.conf.json` est correctement configuré
2. Assurez-vous que le backend Spring Boot est démarré
3. Vérifiez les logs du proxy dans la console

### Problèmes d'Authentification
1. Vérifiez que le token JWT est correctement stocké
2. Assurez-vous que l'intercepteur `AuthInterceptor` est configuré
3. Vérifiez les headers d'autorisation

## 📝 Notes Importantes

1. **Sécurité** : Changez les clés secrètes en production
2. **Base de données** : Configurez une vraie base de données pour la production
3. **Email** : Configurez un vrai service email pour la production
4. **OAuth2** : Configurez les vraies clés OAuth2 pour la production
5. **CORS** : Limitez les origines autorisées en production

## 🔄 Mise à Jour

Pour mettre à jour la configuration :

1. Modifiez les fichiers d'environnement Angular
2. Modifiez le fichier `application.properties` Spring Boot
3. Redémarrez les deux applications
4. Testez la connectivité

## 📞 Support

Pour toute question ou problème de configuration, consultez :
- Documentation Angular : https://angular.io/docs
- Documentation Spring Boot : https://spring.io/projects/spring-boot
- Documentation Spring Security : https://spring.io/projects/spring-security
