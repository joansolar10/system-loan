# Guía de Instalación Rápida

Esta guía te ayudará a levantar el sistema de gestión de préstamos en tu entorno local.

## Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- ✅ Node.js v18 o superior
- ✅ PostgreSQL v14 o superior
- ✅ npm (viene con Node.js)

## Paso 1: Instalar PostgreSQL

### Windows
1. Descargar PostgreSQL desde https://www.postgresql.org/download/windows/
2. Ejecutar el instalador
3. Recordar la contraseña que estableciste para el usuario `postgres`

### macOS
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Paso 2: Crear la Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Dentro de psql, ejecutar:
CREATE DATABASE loan_management;

# Verificar que se creó
\l

# Salir
\q
```

## Paso 3: Configurar Backend

```bash
# Ir a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env
```

**Editar el archivo `.env`** y configurar:

```env
DB_PASSWORD=tu_contraseña_de_postgres
JWT_SECRET=cambia-este-secreto-por-uno-seguro-aleatorio
```

**Ejecutar migraciones:**

```bash
npm run migrate
```

**Crear usuario administrador:**

```bash
npm run seed
```

## Paso 4: Configurar Frontend

```bash
# Ir a la carpeta frontend (desde la raíz del proyecto)
cd ../frontend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env
```

El archivo `.env` ya debe tener la configuración correcta por defecto.

## Paso 5: Ejecutar la Aplicación

### Opción A: Dos terminales separadas

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

Deberías ver:
```
✅ Connected to PostgreSQL database
🚀 Server running on port 3000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Deberías ver:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Opción B: VS Code con terminales divididas

1. Abrir VS Code
2. Abrir el proyecto: `File > Open Folder` → seleccionar carpeta `system-loan`
3. Abrir terminal integrada: `Ctrl + \`` (o `View > Terminal`)
4. Dividir terminal: Click en el ícono de dividir (o `Ctrl + Shift + 5`)
5. En la primera terminal:
   ```bash
   cd backend
   npm run dev
   ```
6. En la segunda terminal:
   ```bash
   cd frontend
   npm run dev
   ```

## Paso 6: Acceder a la Aplicación

1. Abrir navegador en: **http://localhost:5173**

2. Usar credenciales por defecto:
   - Email: `admin@loans.com`
   - Password: `Admin123!`

3. ¡Listo! Ya puedes crear préstamos.

## Verificación de Instalación

### ✅ Checklist

- [ ] PostgreSQL está corriendo
- [ ] Base de datos `loan_management` creada
- [ ] Backend ejecutando en puerto 3000
- [ ] Frontend ejecutando en puerto 5173
- [ ] Puedes hacer login en la aplicación

### Comandos Útiles

**Ver logs del backend:**
```bash
cd backend
npm run dev
# Los logs aparecerán en la consola
```

**Ejecutar tests:**
```bash
cd backend
npm test
```

**Limpiar y reinstalar dependencias:**
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

### Error: "connect ECONNREFUSED ::1:5432"

**Solución:** PostgreSQL no está corriendo

```bash
# Linux
sudo systemctl start postgresql

# macOS
brew services start postgresql@14

# Windows
Iniciar el servicio desde Services.msc
```

### Error: "password authentication failed"

**Solución:** Contraseña incorrecta en `.env`

1. Editar `backend/.env`
2. Cambiar `DB_PASSWORD` a la contraseña correcta de PostgreSQL

### Error: "Port 3000 is already in use"

**Solución:** Otro proceso está usando el puerto

```bash
# Linux/macOS
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: "Cannot find module"

**Solución:** Reinstalar dependencias

```bash
npm install
```

## Siguiente Paso

Una vez que todo esté funcionando, lee el `README.md` para más información sobre:
- Uso de la aplicación
- API endpoints
- Estructura del proyecto
- Despliegue en producción

## Soporte

Si tienes problemas, revisa:
1. Los logs en la consola
2. El archivo `.env` tiene todas las variables
3. PostgreSQL está corriendo
4. Los puertos 3000 y 5173 están libres
