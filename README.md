# Archivero Seguro - Backend

API REST para gestión segura de credenciales (emails, contraseñas, notas) con arquitectura hexagonal.

## Stack

- **Runtime:** Bun
- **Lenguaje:** TypeScript
- **Framework:** Express
- **Base de datos:** MongoDB
- **ORM:** Prisma
- **Validación:** Zod
- **Autenticación:** JWT + Refresh Tokens
- **Cifrado:** AES-256-GCM
- **Hashing:** Bun.password (bcrypt)

## Instalación

```bash
bun install
```

## Configuración

Copiar `.env.example` a `.env` y ajustar variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/secure_archive
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
AES_SECRET_KEY=32-characters-minimum-key-here!
NODE_ENV=development
```

## Inicializar base de datos

```bash
bunx prisma generate
bunx prisma db push
bun run seed
```

## Ejecutar

```bash
bun run dev
```

## Seed - Usuarios por defecto

| Rol    | Email                | Password    |
|--------|----------------------|-------------|
| ADMIN  | admin@archivero.com  | Admin123!   |
| USER   | user@archivero.com   | User1234!   |

## Endpoints

### Auth
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/verify-pin` - Verificar PIN

### Users (requiere ADMIN)
- `POST /api/users` - Crear usuario
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Roles (requiere ADMIN)
- `POST /api/roles` - Crear rol
- `GET /api/roles` - Listar roles
- `GET /api/roles/:id` - Obtener rol
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol
- `POST /api/roles/assign` - Asignar rol a usuario

### Credentials
- `POST /api/credentials` - Crear credencial
- `GET /api/credentials` - Listar credenciales (soporta ?categoryId= y ?favorite=true)
- `GET /api/credentials/search?q=` - Buscar credenciales
- `GET /api/credentials/:id` - Detalle de credencial
- `PUT /api/credentials/:id` - Actualizar credencial
- `PATCH /api/credentials/:id/favorite` - Marcar/desmarcar favorito
- `DELETE /api/credentials/:id` - Eliminar credencial

### Categories
- `POST /api/categories` - Crear categoría
- `GET /api/categories` - Listar categorías
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Security Logs
- `GET /api/security-logs` - Listar logs (ADMIN ve todos, USER ve los suyos)

## Arquitectura

```
src/
├── domain/          # Entidades y puertos (interfaces)
├── application/     # Casos de uso (lógica de negocio)
├── infrastructure/  # Implementaciones (Prisma, JWT, AES, etc.)
└── interfaces/      # Controladores, rutas, middlewares
```
