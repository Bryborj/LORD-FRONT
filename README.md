# LORD - Inventario Inteligente

**LORD** (Logística, Organización y Registro de Datos) es una plataforma web para la gestión inteligente de inventarios enfocada en pequeñas y medianas empresas (PYMES). Su objetivo es optimizar el control de productos, ventas, empleados y reportes, todo desde una interfaz accesible, moderna y eficiente.

## 🧠 Tecnologías utilizadas

### 🔹 Frontend

- React.js
- React Router DOM
- Tailwind CSS + Material Tailwind
- Heroicons
- Axios
- Recharts

### 🔹 Backend

- Node.js
- Express
- MongoDB (Mongoose)
- JWT para autenticación
- ml-regression

---

## 🚀 Funcionalidades

* 🔐 Autenticación de usuarios con control de acceso
* 🛒 Punto de venta para registrar ventas en tiempo real
* 📦 CRUD de productos con gestión visual e interactiva
* 👨‍💼 Registro y administración de empleados
* 🎫 Generación y consulta de tickets de venta
* 📈 Panel de reportes con visualización de datos y predicción de demanda
* 📊 Predicción de demanda de productos usando regresión lineal simple en JavaScript
* 📱 Diseño responsive (adaptado a escritorio y móviles)

---

## ⚙️ Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/LORD-FRONT.git
cd LORD-FRONT
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo ``.env `` dentro de ``front_lord``

```js
REACT_APP_API_URL=http:localhost:5000
```

Cambia la URL si tu backend corre en otro puerto.

### 4. Ejecuta el frontend

```bash
npm start
```

El frontend se abrirá en ``http://localhost:3000``.

## ☁️ Despliegue en Vercel

El frontend se puede desplegar fácilmente en  **Vercel** . Solo asegúrate de configurar la variable de entorno:

```js
REACT_APP_API_URL=https://tu-backend-api.com
```

Y luego ejecuta `npm run build` para generar el contenido estático que será publicado.

## 🔐 Variables de entorno requeridas

| Variable              | Descripción                               |
| --------------------- | ------------------------------------------ |
| `REACT_APP_API_URL` | URL base del backend (local o producción) |

## 📁 Estructura del proyecto

```bash
front_lord/
├── public/
├── src/
│   ├── components/       # Sidebar, gráficos, etc.
│   ├── pages/            # Páginas del sistema (POS, productos, etc.)
│   ├── App.js
│   ├── index.js
│   └── config.js         # Lectura de la API_URL desde .env
├── .env
├── package.json
└── tailwind.config.js
```

## 🧠 Predicción de demanda

Para estimar la demanda futura de productos, se implementó un modelo de regresión lineal simple usando la librería `ml-regression` directamente en el frontend, eliminando así la necesidad de un servidor Python o librerías adicionales.

## 👥 Autor

Proyecto desarrollado por **Bryan Borges** como parte del sistema LORD - Inventario Inteligente.
