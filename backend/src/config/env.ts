import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'loan_management',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@loans.com',
    password: process.env.ADMIN_PASSWORD || 'Admin123!',
  },

  reniec: {
    apiUrl: process.env.RENIEC_API_URL || 'https://api.apis.net.pe/v1/dni',
    apiToken: process.env.RENIEC_API_TOKEN || '',
  },

  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '3600'),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  ddjj: {
    threshold1: parseFloat(process.env.DDJJ_THRESHOLD_1 || '5000'),
    threshold2: parseFloat(process.env.DDJJ_THRESHOLD_2 || '10000'),
  },
};
