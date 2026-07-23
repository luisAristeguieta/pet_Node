# Pet Management System 🐾

Aplicación Full-Stack para registrar usuarios y gestionar mascotas con fotos utilizando seguridad JWT.

## 🚀 Tecnologías
- **Backend:** Java Spring Boot, Spring Security, JPA.
- **Frontend:** React, React Router, CSS Grid.
- **Base de Datos:** PostgreSQL.

## 🔒 Flujo de Seguridad
1. El usuario se registra (`/register`) y su contraseña se encripta con **BCrypt**.
2. Al iniciar sesión (`/login`), recibe un **Token JWT**.
3. El frontend guarda el token y lo incluye en los encabezados de cada petición para acceder a las rutas protegidas (`/profile`, `/pet`).

## 📡 Endpoints Principales
- `POST /auth/register` - Registrar usuario (USER/ADMIN).
- `POST /auth/login` - Iniciar sesión y obtener JWT.
- `GET /auth/pets` - Listar mascotas registradas.
- `GET /auth/pets/{id}/photo` - Descargar la foto de la mascota (`Blob`).
- `POST /auth/pets/register` - Guardar nueva mascota con foto (`Multipart`).
- `PUT /auth/pets/{id}` - Editar datos o foto de una mascota.
- `DELETE /auth/pets/{id}` - Eliminar mascota del sistema.
