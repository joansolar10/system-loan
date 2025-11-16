# Sistema de Gestión de Préstamos

Sistema completo para gestionar préstamos con cálculo de amortización francesa, integración con API RENIEC para validación de DNI, y generación de declaraciones juradas en PDF.

## Características

- **Autenticación segura**: Login con JWT y hash de contraseñas con bcrypt
- **Gestión de clientes**: Registro por DNI con autocompletado desde RENIEC
- **Préstamos con sistema francés**: Cálculo automático de cuotas y cronograma de amortización
- **Validaciones robustas**: DNI de 8 dígitos, plazos múltiplos de 30 días, tasas de interés válidas
- **Declaraciones juradas**: Generación automática de PDF para préstamos > S/ 5,000
- **Cache y rate limiting**: Protección contra consultas excesivas a RENIEC
- **Tests unitarios**: Cobertura de lógica de amortización y validaciones
- **Frontend moderno**: React + TypeScript + Tailwind CSS

## Stack Tecnológico

### Backend
- Node.js + Express + TypeScript
- PostgreSQL
- JWT para autenticación
- bcryptjs para hash de contraseñas
- PDFKit para generación de PDFs
- Jest para tests

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Requisitos Previos

- Node.js >= 18.x
- **Opción A (Recomendado):** Cuenta en [Supabase](https://supabase.com) (gratis)
- **Opción B:** PostgreSQL >= 14.x instalado localmente
- npm o yarn

## Instalación y Configuración

### Opción A: Con Supabase (Recomendado - Más Fácil) ⭐

**📖 Guía completa:** Ver [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Resumen rápido:**

1. **Crear proyecto en Supabase:**
   - Ir a [supabase.com](https://supabase.com) y crear cuenta
   - Crear nuevo proyecto (guarda la contraseña)
   - Obtener connection string: Settings → Database → Connection string (URI)

2. **Configurar Backend:**

```bash
cd backend
npm install
cp .env.example .env
```

Editar `.env`:

```env
USE_SUPABASE=true
DATABASE_URL=postgresql://postgres.xxxxx:TuPassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
JWT_SECRET=tu-secreto-super-seguro-cambialo-en-produccion
ADMIN_EMAIL=admin@loans.com
ADMIN_PASSWORD=Admin123!
```

3. **Ejecutar migraciones:**

```bash
npm run migrate  # Crear tablas en Supabase
npm run seed     # Crear usuario admin
```

### Opción B: Con PostgreSQL Local

1. **Instalar y configurar PostgreSQL:**

```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE loan_management;
\q
```

2. **Configurar Backend:**

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
DB_PASSWORD=tu_password
JWT_SECRET=tu-secreto-super-seguro
ADMIN_EMAIL=admin@loans.com
ADMIN_PASSWORD=Admin123!
```

3. **Ejecutar migraciones:**

```bash
npm run migrate
npm run seed
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env`:

```bash
cp .env.example .env
```

Contenido de `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

## Ejecución en Desarrollo

### Opción 1: Ejecutar Backend y Frontend en terminales separadas

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

El backend estará disponible en `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### Opción 2: Usar VS Code con múltiples terminales

1. Abrir el proyecto en VS Code
2. Abrir terminal (Ctrl + `)
3. Dividir terminal (ícono de dividir o Ctrl + Shift + 5)
4. En la primera terminal:
   ```bash
   cd backend && npm run dev
   ```
5. En la segunda terminal:
   ```bash
   cd frontend && npm run dev
   ```

## Ejecutar Tests

```bash
cd backend
npm test
```

Para ver cobertura:

```bash
npm test -- --coverage
```

## Uso de la Aplicación

### 1. Acceder al Sistema

Abrir navegador en `http://localhost:5173`

**Credenciales por defecto:**
- Email: `admin@loans.com`
- Password: `Admin123!`

### 2. Crear un Préstamo

1. Click en "Nuevo Préstamo"
2. Ingresar DNI del cliente (8 dígitos)
3. Click en "Buscar" para autocompletar desde RENIEC
4. Si no existe en RENIEC, usar datos mock o ingresar manualmente
5. Completar datos del préstamo:
   - Monto principal en soles
   - Tasa de interés anual (%)
   - Plazo en días (múltiplo de 30)
6. Click en "Crear Préstamo"

### 3. Ver Cronograma de Pagos

1. Desde el dashboard, click en "Ver Detalles" de un préstamo
2. Se mostrará:
   - Resumen del préstamo
   - Cronograma completo de amortización
   - Opción de descargar DDJJ (si aplica)

### 4. Descargar Declaración Jurada

Si el préstamo tiene monto ≥ S/ 5,000:
- En la página de detalles del préstamo
- Click en "Descargar DDJJ (PDF)"
- El PDF se descargará automáticamente

## API Endpoints

### Autenticación

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@loans.com",
  "password": "Admin123!"
}
```

### Clientes

```http
GET /api/clients/:dni
Authorization: Bearer <token>

GET /api/clients
Authorization: Bearer <token>

POST /api/clients
Authorization: Bearer <token>
Content-Type: application/json

{
  "dni": "12345678",
  "nombre_completo": "Juan Pérez"
}
```

### Préstamos

```http
POST /api/loans
Authorization: Bearer <token>
Content-Type: application/json

{
  "client_id": 1,
  "monto_principal": 10000,
  "interes_anual_porcentaje": 12,
  "plazo_en_dias": 360
}

GET /api/loans
Authorization: Bearer <token>

GET /api/loans/:id
Authorization: Bearer <token>

GET /api/loans/:id/payments
Authorization: Bearer <token>

GET /api/loans/:id/ddjj
Authorization: Bearer <token>
```

Ver `postman_collection.json` para más detalles.

## Fórmulas de Cálculo

### Sistema de Amortización Francés

**Tasa por período (30 días):**
```
i_periodo = (tasa_anual / 100) × (30 / 365)
```

**Cuota fija:**
```
C = P × [r / (1 - (1 + r)^-n)]

Donde:
- C = Cuota fija
- P = Monto principal
- r = Tasa de interés por período
- n = Número de períodos
```

**Para cada cuota:**
```
Interés del período = Saldo × i_periodo
Capital amortizado = Cuota - Interés
Saldo restante = Saldo anterior - Capital amortizado
```

## Estructura del Proyecto

```
system-loan/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores HTTP
│   │   ├── services/        # Lógica de negocio
│   │   ├── models/          # Modelos de base de datos
│   │   ├── routes/          # Definición de rutas
│   │   ├── middleware/      # Middleware (auth, errors, etc.)
│   │   ├── utils/           # Utilidades y validadores
│   │   ├── config/          # Configuración
│   │   ├── migrations/      # Migraciones SQL
│   │   └── seeds/           # Datos iniciales
│   ├── __tests__/           # Tests unitarios
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas
│   │   ├── services/        # Servicios API
│   │   └── types/           # Tipos TypeScript
│   └── package.json
└── README.md
```

## Variables de Entorno

### Backend (.env)

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loan_management
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
ADMIN_EMAIL=admin@loans.com
ADMIN_PASSWORD=Admin123!
RENIEC_API_URL=https://api.apis.net.pe/v1/dni
RENIEC_API_TOKEN=your-token
CACHE_TTL=3600
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
DDJJ_THRESHOLD_1=5000
DDJJ_THRESHOLD_2=10000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Autenticación JWT con tokens de 24h
- ✅ Rate limiting en endpoints
- ✅ Validación de datos server-side con Joi
- ✅ Sanitización de inputs
- ✅ CORS configurado
- ✅ Cache de consultas RENIEC

## Troubleshooting

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Iniciar PostgreSQL
sudo systemctl start postgresql
```

### Error "JWT_SECRET is not defined"

Asegurarse de que el archivo `.env` exista y contenga `JWT_SECRET`

### Error al crear préstamo

- Verificar que el plazo sea múltiplo de 30
- Verificar que la tasa de interés esté entre 0-100%
- Verificar que el cliente exista

## Producción

### Build Backend

```bash
cd backend
npm run build
npm start
```

### Build Frontend

```bash
cd frontend
npm run build
npm run preview
```

Los archivos estáticos estarán en `frontend/dist/`

## Licencia

ISC

## Autor

Sistema desarrollado para gestión de préstamos con sistema de amortización francesa.
