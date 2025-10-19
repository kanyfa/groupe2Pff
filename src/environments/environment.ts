export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: 'Sama Papier',
  jwtSecret: 'samaPapierSecretKey123456789012345678901234567890',
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
    url: 'jdbc:mysql://localhost:3306/docufind',
    driver: 'com.mysql.cj.jdbc.Driver',
    username: 'root',
    password: 'nani',
    h2ConsoleEnabled: false,
    mysqlEnabled: true,
    host: 'localhost',
    port: 3306,
    databaseName: 'docufind',
    timezone: 'UTC',
    useSSL: false,
    allowPublicKeyRetrieval: true
  }
};
