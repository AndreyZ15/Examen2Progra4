const sql = require("mssql");

// Cargar las variables de entorno desde el archivo .env
require('dotenv').config({ path: 'C:/Users/andre/Documents/U/7 cuatrimestre/Programacion IV/Examen2/backend/.env' });

// // Depurar: Mostrar las variables de entorno cargadas
// console.log("Variables de entorno cargadas:");
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
// console.log("DB_SERVER:", process.env.DB_SERVER);
// console.log("DB_NAME:", process.env.DB_NAME);

// Verificar que las variables de entorno estén definidas
const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`La variable de entorno ${envVar} no está definida en el archivo .env`);
  }
}

// Configuración de la conexión
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Intentar conectar a SQL Server
sql.connect(config)
  .then(() => {
    console.log("Conectado a SQL Server");
  })
  .catch((err) => {
    console.error("Error de conexión:", err);
    process.exit(1);
  });

module.exports = sql;

