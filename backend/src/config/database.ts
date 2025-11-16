import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuración para Supabase
// Supabase proporciona una DATABASE_URL que podemos usar directamente
// O podemos usar parámetros individuales

const isSupabase = process.env.USE_SUPABASE === 'true';

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isSupabase
        ? {
            rejectUnauthorized: false, // Necesario para Supabase
          }
        : undefined,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '6543'), // Supabase usa 6543 para connection pooling
      database: process.env.DB_NAME || 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      ssl: isSupabase
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
    };

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database' + (isSupabase ? ' (Supabase)' : ''));
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
