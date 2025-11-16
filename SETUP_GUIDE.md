# Guía de Instalación Rápida

Esta guía te ayudará a levantar el sistema de gestión de préstamos en tu entorno local.

## Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- ✅ Node.js v18 o superior
- ✅ npm (viene con Node.js)
- ✅ Una cuenta en Supabase (gratis) **O** PostgreSQL local

## Opción 1: Supabase (Recomendado - Más Fácil) ⭐

### ¿Por qué Supabase?
- ✅ No necesitas instalar PostgreSQL
- ✅ Gratis para desarrollo
- ✅ Se configura en 5 minutos
- ✅ Dashboard visual para ver tus datos

### Paso 1: Configurar Supabase

**Sigue la guía completa:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Resumen rápido:**

1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear nuevo proyecto (guarda la contraseña)
3. Ir a Settings → Database → Connection string
4. Copiar la URI (modo "Session pooling")

### Paso 2: Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
```

Editar `.env`:

```env
USE_SUPABASE=true
DATABASE_URL=postgresql://postgres.xxxxx:TuPassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
JWT_SECRET=cambia-este-secreto-por-uno-aleatorio
ADMIN_EMAIL=admin@loans.com
ADMIN_PASSWORD=Admin123!
```

**Ejecutar migraciones:**

```bash
npm run migrate
npm run seed
```

### Paso 3: Configurar Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

### Paso 4: Ejecutar la Aplicación

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

Deberías ver:
```
✅ Connected to PostgreSQL database (Supabase)
🚀 Server running on port 3000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Paso 5: Acceder

Abrir: **http://localhost:5173**

Login:
- Email: `admin@loans.com`
- Password: `Admin123!`

---

## Opción 2: PostgreSQL Local (Alternativa)

### Paso 1: Instalar PostgreSQL

#### Windows
1. Descargar PostgreSQL desde https://www.postgresql.org/download/windows/
2. Ejecutar el instalador
3. Recordar la contraseña del usuario `postgres`

#### macOS
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Paso 2: Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql:
CREATE DATABASE loan_management;
\l  # Verificar
\q  # Salir
```

### Paso 3: Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
```

Editar `.env`:

```env
USE_SUPABASE=false
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loan_management
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres
JWT_SECRET=cambia-este-secreto
ADMIN_EMAIL=admin@loans.com
ADMIN_PASSWORD=Admin123!
```

**Ejecutar migraciones:**

```bash
npm run migrate
npm run seed
```

### Paso 4: Configurar Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

### Paso 5: Ejecutar

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

Acceder a: http://localhost:5173

---

## Uso con VS Code (Ambas opciones)

1. Abrir VS Code
2. Abrir carpeta `system-loan`
3. Abrir terminal integrada (`Ctrl + \``)
4. Dividir terminal (ícono de dividir)
5. Terminal 1: `cd backend && npm run dev`
6. Terminal 2: `cd frontend && npm run dev`

## Verificación

### ✅ Checklist

- [ ] Backend corriendo (puerto 3000)
- [ ] Frontend corriendo (puerto 5173)
- [ ] Puedes hacer login
- [ ] Puedes crear un préstamo de prueba

### Comandos Útiles

**Ver logs del backend:**
```bash
cd backend
npm run dev
```

**Ejecutar tests:**
```bash
cd backend
npm test
```

**Limpiar y reinstalar:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Problemas Comunes

### Supabase

**Error: "password authentication failed"**

Solución: Verifica que la contraseña en `DATABASE_URL` sea correcta.

1. Supabase Dashboard → Settings → Database
2. Reset database password
3. Actualiza `DATABASE_URL` con la nueva contraseña

**Error: "SSL connection required"**

Solución: Ya está configurado. Asegúrate de tener `USE_SUPABASE=true`

### PostgreSQL Local

**Error: "connect ECONNREFUSED ::1:5432"**

Solución: PostgreSQL no está corriendo

```bash
# Linux
sudo systemctl start postgresql

# macOS
brew services start postgresql@14

# Windows
Iniciar servicio desde Services.msc
```

**Error: "database does not exist"**

Solución: Crear la base de datos

```bash
psql -U postgres -c "CREATE DATABASE loan_management;"
```

### General

**Error: "Port 3000 already in use"**

Solución: Matar el proceso

```bash
# Linux/macOS
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Error: "Cannot find module"**

Solución: Reinstalar dependencias

```bash
npm install
```

## Próximos Pasos

Una vez funcionando:

1. Lee el [README.md](./README.md) completo
2. Explora la [Postman Collection](./postman_collection.json)
3. Revisa [FEATURES.md](./FEATURES.md) para ver todas las capacidades
4. Si usas Supabase, revisa [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

## Soporte

Si tienes problemas:

1. Revisa los logs en la consola
2. Verifica el archivo `.env`
3. Asegúrate que los puertos estén libres
4. Consulta las guías específicas:
   - [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para Supabase
   - [README.md](./README.md) para referencia completa

¡Listo para gestionar préstamos! 🚀
