export const environment = {
  production: true,
  apiUrl: 'https://your-production-api-url.com/api',
  appName: 'Sama Papier',
  jwtSecret: 'samaPapierSecretKey123456789012345678901234567890',
  jwtExpiration: 86400000,
  uploadDir: 'uploads/',
  maxFileSize: 10485760, // 10MB en bytes
  corsOrigins: ['https://your-production-frontend-url.com'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*'],
  allowCredentials: true,
  emailConfig: {
    host: 'smtp.gmail.com',
    port: 587,
    username: 'your-sama-papier-email@gmail.com',
    password: 'your-sama-papier-app-password'
  },
  oauth2: {
    google: {
      clientId: 'your-sama-papier-google-client-id',
      clientSecret: 'your-sama-papier-google-client-secret',
      scope: 'email,profile'
    }
  },
  database: {
    url: 'jdbc:mysql://your-production-db-host:3306/docufind',
    driver: 'com.mysql.cj.jdbc.Driver',
    username: 'root',
    password: 'your-production-password',
    h2ConsoleEnabled: false,
    mysqlEnabled: true,
    host: 'your-production-db-host',
    port: 3306,
    databaseName: 'docufind',
    timezone: 'UTC',
    useSSL: true,
    allowPublicKeyRetrieval: false
  }
};
