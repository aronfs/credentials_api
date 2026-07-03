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

### Profile
- `GET /api/profile/me` - Obtener perfil con estadísticas (total de credenciales, categorías, favoritos y foto de perfil)
- `PUT /api/profile/me` - Actualizar nombre
  ```json
  { "name": "Nuevo Nombre" }
  ```
- `PATCH /api/profile/change-pin` - Cambiar PIN
  ```json
  { "currentPin": "1234", "newPin": "5678" }
  ```
- `PATCH /api/profile/change-password` - Cambiar contraseña
  ```json
  { "currentPassword": "actual", "newPassword": "nueva123" }
  ```

### Profile Image (requiere JWT)
- `GET /api/v1/profile-image` - Obtener metadatos de la foto de perfil
- `GET /api/v1/profile-image/file` - Descargar archivo físico de la foto de perfil
- `POST /api/v1/profile-image` - Subir/actualizar foto de perfil (`multipart/form-data`, campo: `file`)
  - Formatos aceptados: JPG, PNG, WEBP
  - Tamaño máximo: 5 MB
  - Reemplaza automáticamente la imagen anterior
- `DELETE /api/v1/profile-image` - Eliminar foto de perfil (idempotente)

Los archivos estáticos se sirven públicamente en `/storage/images/...`.

### Credentials
- `POST /api/credentials` - Crear credencial
- `GET /api/credentials` - Listar credenciales
  - Query params: `?categoryId=...` (filtrar por categoría), `?favorite=true` (solo favoritos)
- `GET /api/credentials/search?q=` - Buscar credenciales
- `GET /api/credentials/favorites` - Listar favoritos (paginado)
  - Query params: `?page=1&limit=10&search=...`
- `GET /api/credentials/:id` - Detalle de credencial
- `GET /api/credentials/:id/password` - Ver contraseña (requiere permiso `credentials:read`)
- `PUT /api/credentials/:id` - Actualizar credencial
- `PATCH /api/credentials/:id/favorite` - Marcar como favorito
- `PATCH /api/credentials/:id/unfavorite` - Quitar de favoritos
- `PATCH /api/credentials/:id/toggle-favorite` - Alternar favorito
- `DELETE /api/credentials/:id` - Eliminar credencial

### Categories
- `POST /api/categories` - Crear categoría
- `GET /api/categories` - Listar categorías (incluye `totalCredentials` por categoría)
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
