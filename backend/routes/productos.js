const express = require('express');
const router = express.Router();
const sql = require('../db');

// Middleware para manejar errores de conexión
const ensureDbConnection = async (req, res, next) => {
  try {
    await sql.connect(sql.config);
    next();
  } catch (err) {
    console.error('Error de conexión en la ruta:', err);
    res.status(500).send('Error de conexión a la base de datos');
  }
};

// Endpoint para obtener todos los productos
router.get('/', ensureDbConnection, async (req, res) => {
  try {
    let pool = await sql.connect(sql.config);
    let result = await pool.request().query('SELECT * FROM Productos');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener productos');
  }
});

// Endpoint para buscar productos por nombre
router.get('/buscar', ensureDbConnection, async (req, res) => {
  const nombre = req.query.nombre;
  if (!nombre) {
    return res.status(400).send('El parámetro "nombre" es requerido');
  }

  try {
    let pool = await sql.connect(sql.config);
    let result = await pool
      .request()
      .input('nombre', sql.NVarChar, `%${nombre}%`)
      .query('SELECT * FROM Productos WHERE Nombre LIKE @nombre');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al buscar productos');
  }
});

// Endpoint para agregar un nuevo producto
router.post('/', ensureDbConnection, async (req, res) => {
  const { nombre, precio, cantidad } = req.body;
  if (!nombre || !precio || !cantidad) {
    return res.status(400).send('Faltan datos requeridos');
  }

  try {
    let pool = await sql.connect(sql.config);
    await pool
      .request()
      .input('nombre', sql.NVarChar, nombre)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('cantidad', sql.Int, cantidad)
      .input('fecha', sql.Date, new Date())
      .query(
        'INSERT INTO Productos (Nombre, PrecioUnitario, CantidadStock, FechaRegistro) VALUES (@nombre, @precio, @cantidad, @fecha)'
      );
    res.status(201).send('Producto agregado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al agregar producto');
  }
});

// Endpoint para actualizar un producto
router.put('/:id', ensureDbConnection, async (req, res) => {
  const id = req.params.id;
  const { nombre, precio, cantidad } = req.body;

  try {
    let pool = await sql.connect(sql.config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar, nombre)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('cantidad', sql.Int, cantidad)
      .query(
        'UPDATE Productos SET Nombre = @nombre, PrecioUnitario = @precio, CantidadStock = @cantidad WHERE ID = @id'
      );
    res.send('Producto actualizado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar producto');
  }
});

// Endpoint para eliminar un producto
router.delete('/:id', ensureDbConnection, async (req, res) => {
  const id = req.params.id;

  try {
    let pool = await sql.connect(sql.config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Productos WHERE ID = @id');
    res.send('Producto eliminado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar producto');
  }
});

module.exports = router;



