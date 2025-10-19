import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = environment;

  constructor() { }

  // Configuration de l'API
  getApiUrl(): string {
    return this.config.apiUrl;
  }

  getAppName(): string {
    return this.config.appName;
  }

  // Configuration JWT
  getJwtSecret(): string {
    return this.config.jwtSecret;
  }

  getJwtExpiration(): number {
    return this.config.jwtExpiration;
  }

  // Configuration des fichiers
  getUploadDir(): string {
    return this.config.uploadDir;
  }

  getMaxFileSize(): number {
    return this.config.maxFileSize;
  }

  // Configuration CORS
  getCorsOrigins(): string[] {
    return this.config.corsOrigins;
  }

  getAllowedMethods(): string[] {
    return this.config.allowedMethods;
  }

  getAllowedHeaders(): string[] {
    return this.config.allowedHeaders;
  }

  getAllowCredentials(): boolean {
    return this.config.allowCredentials;
  }

  // Configuration Email
  getEmailConfig() {
    return this.config.emailConfig;
  }

  // Configuration OAuth2
  getOAuth2Config() {
    return this.config.oauth2;
  }

  getGoogleOAuth2Config() {
    return this.config.oauth2.google;
  }

  // Configuration Base de données
  getDatabaseConfig() {
    return this.config.database;
  }

  // Configuration MySQL spécifique
  getMySQLConfig() {
    return {
      host: this.config.database.host,
      port: this.config.database.port,
      database: this.config.database.databaseName,
      username: this.config.database.username,
      password: this.config.database.password,
      timezone: this.config.database.timezone,
      useSSL: this.config.database.useSSL,
      allowPublicKeyRetrieval: this.config.database.allowPublicKeyRetrieval
    };
  }

  // Vérification si MySQL est activé
  isMySQLEnabled(): boolean {
    return this.config.database.mysqlEnabled;
  }

  // Vérification si H2 est activé
  isH2Enabled(): boolean {
    return this.config.database.h2ConsoleEnabled;
  }

  // Configuration de production
  isProduction(): boolean {
    return this.config.production;
  }

  // URLs spécifiques pour les endpoints
  getAuthUrl(): string {
    return `${this.config.apiUrl}/auth`;
  }

  getAnnouncementsUrl(): string {
    return `${this.config.apiUrl}/announcements`;
  }

  getMessagesUrl(): string {
    return `${this.config.apiUrl}/messages`;
  }

  getUsersUrl(): string {
    return `${this.config.apiUrl}/users`;
  }

  getAdminUrl(): string {
    return `${this.config.apiUrl}/admin`;
  }

  getUploadUrl(): string {
    return `${this.config.apiUrl}/upload`;
  }

  // Configuration pour les intercepteurs
  getAuthHeaderName(): string {
    return 'Authorization';
  }

  getAuthHeaderPrefix(): string {
    return 'Bearer ';
  }

  // Configuration pour les toasts
  getToastConfig() {
    return {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    };
  }

  // Configuration pour les spinners
  getSpinnerConfig() {
    return {
      type: 'ball-scale-multiple',
      size: 'medium',
      color: '#007bff'
    };
  }
}
