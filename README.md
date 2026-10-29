# Laboratorio 4 - CRUD Negocio

Aplicación sencilla para administrar productos de un negocio usando React, Hooks, Fetch, json-server y Bootstrap.

## Funciones
- Crear productos.
- Consultar el inventario.
- Editar productos.
- Eliminar productos.
- Mostrar el número de productos y las unidades disponibles.

## Requisitos
- Node.js y npm.
- GitHub para guardar el código.

## Cómo ejecutar el proyecto

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Abrir una terminal y ejecutar la API:

   ```bash
   npm run api
   ```

3. Abrir una segunda terminal y ejecutar React:

   ```bash
   npm run dev
   ```

4. Abrir la dirección local que muestra Vite, normalmente `http://localhost:5173`.

La API local de productos funciona normalmente en `http://localhost:3000/productos`.

## Archivos principales
- `src/index.jsx`: inicia React y carga Bootstrap.
- `src/Negocio.jsx`: formulario, tabla y operaciones del CRUD.
- `src/crud.js`: funciones Fetch para consultar, crear, actualizar y eliminar.
- `src/Negocio.css`: estilos de la página.
- `db.json`: datos de ejemplo para json-server.

## Nota
GitHub almacena el código, pero no mantiene ejecutándose por sí solo el servidor local `json-server`. Para que el CRUD funcione, deben estar activos tanto React como la API. Los datos de ejemplo se guardan en `db.json` durante el uso local.
