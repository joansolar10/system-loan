import pool from '../config/database';
import { AuthService } from '../services/authService';
import { env } from '../config/env';

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...');

    // Verificar si ya existe un admin
    const existing = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [env.admin.email]
    );

    if (existing.rows.length > 0) {
      console.log('ℹ️  Admin user already exists');
      process.exit(0);
    }

    // Crear admin
    const passwordHash = await AuthService.hashPassword(env.admin.password);

    await pool.query(
      'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
      [env.admin.email, passwordHash]
    );

    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${env.admin.email}`);
    console.log(`🔑 Password: ${env.admin.password}`);
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedAdmin();
