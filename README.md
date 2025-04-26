```markdown
# Inventario App

Una aplicación web sencilla para gestionar un inventario de productos. Permite agregar, editar, eliminar y buscar productos, con un sistema de autenticación básico. Está construida con Node.js, Express, y una base de datos SQL Server, con un frontend en HTML, CSS y JavaScript.

## Estructura del proyecto
inventario-app/
│
├── frontend/               # Archivos del frontend (HTML, CSS, JS)
│   ├── agregar.html        # Página para agregar nuevos productos
│   ├── index.html          # Página principal con la lista de productos
│   ├── login.html          # Página de inicio de sesión
│   ├── styles.css          # Estilos CSS para el frontend
│   └── script.js           # Lógica JavaScript para el frontend
│
├── routes/                 # Rutas del backend
│   └── productos.js        # Rutas para gestionar productos (CRUD)
│
├── .env.example            # Ejemplo de archivo de entorno con variables requeridas
├── .gitignore              # Archivos y carpetas ignorados por Git
├── db.js                   # Configuración de la conexión a SQL Server
├── index.js                # Archivo principal del backend (Express)
└── README.md               # Documentación del proyecto

### Archivos y carpetas principales

- **`frontend/`**: Contiene los archivos del frontend:
  - `login.html`: Página para iniciar sesión.
  - `index.html`: Muestra la lista de productos y permite buscar.
  - `agregar.html`: Formulario para agregar nuevos productos.
  - `styles.css`: Estilos globales para la aplicación.
  - `script.js`: Lógica del frontend (manejo de formularios, fetch a la API, etc.).
- **`routes/productos.js`**: Define las rutas de la API para gestionar productos (crear, leer, actualizar, eliminar).
- **`db.js`**: Configura la conexión a la base de datos SQL Server.
- **`index.js`**: Archivo principal del backend, configura el servidor Express, las sesiones, y sirve los archivos estáticos del frontend.
- **`.env.example`**: Ejemplo de las variables de entorno necesarias para la configuración.

## Requisitos previos

- **Node.js** (versión 14 o superior): Necesario para ejecutar el servidor.
- **SQL Server**: Una instancia de SQL Server configurada y accesible.
- **Git**: Para clonar el repositorio.

## Configuración y ejecución

Sigue estos pasos para configurar y ejecutar el proyecto localmente:

### 1. Clonar el repositorio

```bash
git clone https://github.com/AndreyZ15/Examen2Progra4.git
cd Examen2Progra4

```
