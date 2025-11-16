# Guía de Configuración con Supabase

Esta guía te ayudará a configurar el sistema de gestión de préstamos usando Supabase como base de datos PostgreSQL.

## ¿Por qué Supabase?

✅ **No necesitas instalar PostgreSQL localmente**
✅ **Gratis hasta 500 MB** (perfecto para desarrollo)
✅ **Dashboard visual** para ver tus datos
✅ **Fácil de desplegar** en producción
✅ **Backups automáticos**
✅ **Connection pooling** incluido

## Paso 1: Crear Cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Click en "Start your project"
3. Registrarte con GitHub, Google o email

## Paso 2: Crear un Nuevo Proyecto

1. Click en "New Project"
2. Completa los datos:
   - **Name**: `loan-management` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (¡guárdala!)
   - **Region**: Selecciona la más cercana a ti
   - **Pricing Plan**: Free (suficiente para empezar)
3. Click en "Create new project"
4. Espera 2-3 minutos mientras se crea el proyecto

## Paso 3: Obtener la Connection String

1. En tu proyecto de Supabase, ve a **Settings** (⚙️ en la barra lateral)
2. Click en **Database**
3. Busca la sección **Connection string**
4. Selecciona el modo **URI** (no "Session mode")
5. Verás algo como:

```
postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

6. **IMPORTANTE**: Reemplaza `[YOUR-PASSWORD]` con la contraseña que creaste en el Paso 2

**Ejemplo:**
```
postgresql://postgres.abcdefghij:MiPassword123!@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Paso 4: Configurar el Backend

1. Ir a la carpeta `backend/`
2. Copiar el archivo de ejemplo:

```bash
cd backend
cp .env.example .env
```

3. Editar el archivo `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database - SUPABASE
USE_SUPABASE=true
DATABASE_URL=postgresql://postgres.xxxxx:TuPassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# JWT (cambiar en producción)
JWT_SECRET=un-secreto-super-seguro-cambialo-12345
JWT_EXPIRES_IN=24h

# Admin por defecto
ADMIN_EMAIL=admin@loans.com
ADMIN_PASSWORD=Admin123!

# RENIEC API (opcional)
RENIEC_API_URL=https://api.apis.net.pe/v1/dni
RENIEC_API_TOKEN=

# Cache
CACHE_TTL=3600

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Declaración Jurada
DDJJ_THRESHOLD_1=5000
DDJJ_THRESHOLD_2=10000
```

**⚠️ IMPORTANTE:** Reemplaza `DATABASE_URL` con tu connection string completa de Supabase.

## Paso 5: Ejecutar Migraciones

Instalar dependencias:

```bash
npm install
```

Crear las tablas en Supabase:

```bash
npm run migrate
```

Deberías ver:
```
🔄 Running migrations...
✅ Migrations completed successfully
```

## Paso 6: Crear Usuario Administrador

```bash
npm run seed
```

Deberías ver:
```
🌱 Seeding admin user...
✅ Admin user created successfully
📧 Email: admin@loans.com
🔑 Password: Admin123!
```

## Paso 7: Verificar en Supabase Dashboard

1. En tu proyecto de Supabase, ve a **Table Editor**
2. Deberías ver las tablas creadas:
   - `admins`
   - `clients`
   - `loans`
   - `payments`

3. Click en la tabla `admins` y verás el usuario administrador creado

## Paso 8: Ejecutar la Aplicación

```bash
# Backend
npm run dev

# En otra terminal, frontend
cd ../frontend
npm install
npm run dev
```

Accede a: http://localhost:5173

Login con:
- Email: `admin@loans.com`
- Password: `Admin123!`

## Verificación de Conexión

Cuando ejecutes `npm run dev` en el backend, deberías ver:

```
✅ Connected to PostgreSQL database (Supabase)
🚀 Server running on port 3000
```

Si ves esto, ¡todo está funcionando correctamente! 🎉

## Troubleshooting

### Error: "password authentication failed"

**Solución:** Verifica que la contraseña en `DATABASE_URL` sea correcta.

1. Ve a Supabase Dashboard → Settings → Database
2. En "Reset database password", genera una nueva contraseña
3. Actualiza tu `DATABASE_URL` con la nueva contraseña

### Error: "connect ECONNREFUSED"

**Solución:** Verifica que `USE_SUPABASE=true` esté en tu `.env`

### Error: "SSL connection required"

**Solución:** Ya está configurado en el código. Asegúrate de tener la última versión.

### Ver los logs de conexión

Supabase Dashboard → Logs → Database logs

## Ventajas de Usar Connection Pooling

Supabase automáticamente usa el puerto **6543** que incluye connection pooling (Supavisor). Esto significa:

✅ Mejor rendimiento
✅ Más conexiones simultáneas
✅ Menos latencia

## Monitoreo y Límites

### Plan Gratuito de Supabase:

- ✅ 500 MB de base de datos
- ✅ 500,000 lecturas/mes
- ✅ 100,000 escrituras/mes
- ✅ 2 GB de transferencia

Para este proyecto de préstamos, el plan gratuito es más que suficiente para desarrollo y pequeñas pruebas.

## Queries Útiles en Supabase

Puedes ejecutar SQL directamente en Supabase:

### Ver todos los préstamos con clientes:

```sql
SELECT
  l.*,
  c.dni,
  c.nombre_completo
FROM loans l
JOIN clients c ON l.client_id = c.id
ORDER BY l.created_at DESC;
```

### Ver estadísticas:

```sql
SELECT
  COUNT(*) as total_prestamos,
  SUM(monto_principal) as monto_total,
  AVG(interes_anual_porcentaje) as tasa_promedio
FROM loans;
```

### Ir a: **SQL Editor** en Supabase Dashboard

## Backups

Supabase automáticamente hace backups diarios. Para acceder:

1. Project Settings → Database → Backups
2. Descarga backups si lo necesitas

## Próximos Pasos

Una vez que todo funcione:

1. ✅ Cambia `JWT_SECRET` por uno más seguro
2. ✅ Cambia la contraseña del admin después del primer login
3. ✅ Considera activar Row Level Security (RLS) en Supabase para más seguridad
4. ✅ Revisa los logs regularmente

## Migración desde PostgreSQL Local

Si ya tenías datos en PostgreSQL local y quieres migrarlos a Supabase:

```bash
# Exportar datos locales
pg_dump -U postgres loan_management > backup.sql

# Importar a Supabase usando el SQL Editor en dashboard
# O usar: psql -h [supabase-host] -U postgres -d postgres -f backup.sql
```

## Soporte

- 📚 [Documentación Supabase](https://supabase.com/docs)
- 💬 [Discord de Supabase](https://discord.supabase.com)
- 🐛 [GitHub Issues del proyecto](https://github.com/supabase/supabase/issues)

¡Listo! Ahora tienes una base de datos PostgreSQL en la nube sin instalar nada localmente. 🚀
