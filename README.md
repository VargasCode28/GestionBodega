# Gestión de Bodega

Aplicación full stack para el control y seguimiento de herramientas, préstamos y devoluciones en un almacén o taller.

## Descripción

Este proyecto permite:
- Autenticación de usuarios con roles `ADMIN` y `WORKER`
- Gestión de herramientas: creación, actualización y eliminación (solo administrador)
- Registro de préstamos y devoluciones de herramientas
- Seguimiento de préstamos activos y de historial completo
- Exportación de datos a Excel y PDF desde el panel de seguimiento

## Tecnologías usadas

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT para autenticación
- bcryptjs para hashing de contraseñas
- dotenv para configuración de variables de entorno
- cors para permitir peticiones desde el frontend
- nodemon para desarrollo

### Frontend
- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- Bootstrap 5
- Bootstrap Icons
- jsPDF + jspdf-autotable
- xlsx
- SweetAlert2

## Estructura del proyecto

- `backend/` → servidor API en Node.js
- `client/` → aplicación frontend en Vue

## Rutas principales

### Autenticación
- `POST /api/auth/login`

### Usuarios (ADMIN)
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `PUT /api/users/:id/toggle`
- `DELETE /api/users/:id`

### Herramientas (ADMIN)
- `GET /api/tools`
- `POST /api/tools`
- `PUT /api/tools/:id`
- `DELETE /api/tools/:id`

### Préstamos / Seguimiento
- `GET /api/borrow` (solo ADMIN)
- `POST /api/borrow`
- `PUT /api/borrow/return/:id` (solo ADMIN)

## Configuración

### Backend
1. Ir a `backend/`
2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor:
   ```bash
   npm run dev
   ```

### Frontend
1. Ir a `client/`
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar la aplicación:
   ```bash
   npm run dev
   ```

## Seguridad y GitHub

- Se recomienda no subir archivos `.env` al repositorio.
- El proyecto ya incluye un `.gitignore` en la raíz que excluye:
  - `node_modules/`
  - `.env`
  - `backend/.env`
  - `client/.env`
  - archivos temporales y de build

## Notas

- El frontend usa rutas protegidas con `localStorage` para el token y el rol del usuario.
- Los usuarios con rol `ADMIN` pueden acceder a la administración de herramientas y al seguimiento completo.
- Los `WORKER` pueden iniciar sesión y ver su panel correspondiente.

## Cómo contribuir

1. Haz un fork del repositorio.
2. Crea una rama nueva: `git checkout -b feature/nombre`
3. Haz tus cambios y prueba localmente.
4. Envía un pull request describiendo los cambios.


<img width="1917" height="872" alt="Screenshot 2026-08-01 112159" src="https://github.com/user-attachments/assets/84ae4277-401b-4904-a91c-b3ba885981bf" />

<img width="1920" height="869" alt="gestionadmin" src="https://github.com/user-attachments/assets/46698415-b67d-49a6-92d9-8f93dcb156be" />

