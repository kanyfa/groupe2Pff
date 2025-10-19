# DocumentFinder - Application de Gestion des Annonces de Perte de Documents

## Description

DocumentFinder est une application web développée avec Angular qui permet aux citoyens de déclarer la perte de leurs documents administratifs et de retrouver ceux qui ont été perdus par d'autres utilisateurs.

## Fonctionnalités

### Pour les Utilisateurs
- **Inscription/Connexion** : Création de compte sécurisé avec authentification
- **Déclaration de perte** : Formulaire intuitif pour déclarer un document perdu
- **Recherche d'annonces** : Filtrage par type de document, lieu, date
- **Messagerie** : Communication directe entre utilisateurs
- **Gestion de profil** : Mise à jour des informations personnelles
- **Notifications** : Alertes par email en cas de correspondance

### Pour les Administrateurs
- **Modération** : Validation des annonces avant publication
- **Gestion des utilisateurs** : Activation/suspension des comptes
- **Statistiques** : Tableau de bord avec métriques importantes
- **Administration** : Interface complète de gestion

## Technologies Utilisées

### Frontend
- **Angular 17** : Framework principal
- **TypeScript** : Langage de programmation
- **Bootstrap 5** : Framework CSS
- **Font Awesome** : Icônes
- **ngx-toastr** : Notifications
- **ngx-spinner** : Indicateurs de chargement

### Backend (Spring Boot)
- **Spring Boot** : Framework Java
- **Spring Security** : Authentification et autorisation
- **JWT** : Tokens d'authentification
- **MySQL** : Base de données
- **REST API** : Architecture API

## Structure du Projet

```
src/
├── app/
│   ├── components/
│   │   ├── auth/           # Composants d'authentification
│   │   ├── announcements/  # Gestion des annonces
│   │   ├── profile/        # Profil utilisateur
│   │   ├── messages/       # Système de messagerie
│   │   └── admin/          # Interface d'administration
│   ├── services/           # Services Angular
│   ├── models/             # Modèles TypeScript
│   ├── guards/             # Guards de navigation
│   ├── interceptors/       # Intercepteurs HTTP
│   └── app-routing.module.ts
├── assets/                 # Ressources statiques
├── environments/           # Configuration d'environnement
└── styles.css             # Styles globaux
```

## Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Angular CLI

### Installation
1. Cloner le repository
2. Installer les dépendances :
   ```bash
   npm install
   ```

### Démarrage en développement
```bash
ng serve
```
L'application sera accessible sur `http://localhost:4200`

### Build de production
```bash
ng build --prod
```

## Configuration

### Variables d'environnement
Modifier les fichiers dans `src/environments/` :
- `environment.ts` : Configuration de développement
- `environment.prod.ts` : Configuration de production

### API Backend
L'URL de l'API est configurée dans les fichiers d'environnement :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Types de Documents Supportés

- Carte Nationale d'Identité
- Passeport
- Carte Grise
- Diplôme
- Permis de Conduire
- Carte Vitale
- Autre

## Sécurité

- Authentification JWT
- Validation côté client et serveur
- Chiffrement des données sensibles
- Protection CSRF
- Validation des entrées utilisateur

## Responsive Design

L'application est entièrement responsive et s'adapte à tous les types d'écrans :
- Desktop
- Tablette
- Mobile

## Accessibilité

- Support des lecteurs d'écran
- Navigation au clavier
- Contraste élevé
- Respect des standards WCAG

## Tests

```bash
# Tests unitaires
ng test

# Tests e2e
ng e2e
```

## Déploiement

### Heroku
1. Configurer les variables d'environnement
2. Déployer avec Git :
   ```bash
   git push heroku main
   ```

### Vercel
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub ou contacter l'équipe de développement.

## Roadmap

- [ ] Application mobile (React Native)
- [ ] Intégration avec les services gouvernementaux
- [ ] Système de géolocalisation avancé
- [ ] Notifications push
- [ ] API publique pour les partenaires
