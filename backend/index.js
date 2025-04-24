const express = require("express");
const cors = require("cors");
const session = require("express-session");
const productosRoutes = require("./routes/productos");
const path = require("path");

const app = express();

// Configuración de CORS para permitir cookies
app.use(
  cors({
    origin: "http://localhost:3000", // Ajusta según el puerto de tu frontend
    credentials: true, // Permitir el envío de cookies
  })
);

// Configuración de sesiones
app.use(
  session({
    secret: "mi-secreto-super-seguro",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }, // secure: true en producción con HTTPS
  })
);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Middlewares
app.use(express.json());

// Middleware para proteger rutas
const requireAuth = (req, res, next) => {
  console.log("Sesión en requireAuth:", req.session); // Depuración
  if (req.session && req.session.user) {
    return next();
  } else {
    res.status(401).send("No autorizado. Por favor inicia sesión.");
  }
};

// Endpoint para login
app.post("/api/login", async (req, res) => {
  const { nombreUsuario, contrasena } = req.body;

  if (!nombreUsuario || !contrasena) {
    return res.status(400).send("Faltan datos requeridos");
  }

  try {
    const sql = require("./db");
    let pool = await sql.connect(sql.config);
    let result = await pool
      .request()
      .input("nombreUsuario", sql.NVarChar, nombreUsuario)
      .input("contrasena", sql.NVarChar, contrasena)
      .query(
        "SELECT * FROM Usuarios WHERE NombreUsuario = @nombreUsuario AND Contrasena = @contrasena"
      );

    if (result.recordset.length === 0) {
      return res.status(401).send("Usuario o contraseña incorrectos");
    }

    // Guardar el usuario en la sesión
    req.session.user = result.recordset[0];
    console.log("Sesión después de login:", req.session); // Depuración
    res.json({ message: "Login exitoso", user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al autenticar usuario");
  }
});

// Endpoint para cerrar sesión
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error al cerrar sesión");
    }
    res.json({ message: "Sesión cerrada" });
  });
});

// Endpoint para verificar si el usuario está autenticado
app.get("/api/check-auth", (req, res) => {
  console.log("Sesión en check-auth:", req.session); // Depuración
  if (req.session && req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Proteger las rutas de productos
app.use("/api/productos", requireAuth, productosRoutes);

// Ruta raíz opcional
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de productos.");
});

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});