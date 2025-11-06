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
    driver: 'com.mysql.cj.jdbc.Driver',
    username: 'root',
    password: 'nani',
    h2ConsoleEnabled: false,
    mysqlEnabled: true,
    host: 'localhost',
    port: 3306,
    databaseName: 'lost_documents_db',
    timezone: 'UTC',
    useSSL: false,
    allowPublicKeyRetrieval: true
  }
};
