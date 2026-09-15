<img width="1071" height="707" alt="NoSQL" src="https://github.com/user-attachments/assets/87cb0d6a-e275-42f6-b1f1-5b3989886912" />
# ContruSoft

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


<img width="1917" height="853" alt="login" src="https://github.com/user-attachments/assets/e68cb4c9-c7d7-4b8c-bd2c-209a8dae0bb3" />

<img width="1917" height="865" alt="dashboard" src="https://github.com/user-attachments/assets/8caa5a8d-ee63-4dbf-9050-cc1f77bb6cea" />

<img width="1913" height="866" alt="Usuario" src="https://github.com/user-attachments/assets/9811b3b8-f1cc-4c04-8062-eb3fbbfd7f51" />

<img width="1071" height="707" alt="NoSQL" src="https://github.com/user-attachments/assets/ad53477f-f4e6-4979-814a-a03cc4dd86c5" />


