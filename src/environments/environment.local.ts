export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'Lost Documents App',
  jwtSecret: 'mySecretKey123456789012345678901234567890',
  jwtExpiration: 86400000,
  uploadDir: 'uploads/',
  maxFileSize: 10485760, // 10MB en bytes
  corsOrigins: ['http://localhost:4200', 'http://localhost:3000'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*'],
  allowCredentials: true,
  emailConfig: {
    host: 'smtp.gmail.com',
    port: 587,
    username: 'your-email@gmail.com',
    password: 'your-app-password'
  },
  oauth2: {
    google: {
      clientId: 'your-google-client-id',
      clientSecret: 'your-google-client-secret',
      scope: 'email,profile'
    }
  },
  database: {
    url: 'jdbc:mysql://localhost:3306/lost_documents_db',
    driver: 'org.h2.Driver',
    username: 'root',
    password: 'nani',
    h2ConsoleEnabled: true
  },
  // Configuration spécifique au développement local
  debug: true,
  logLevel: 'DEBUG',
  enableMockData: false,
  enableApiLogging: true
};

