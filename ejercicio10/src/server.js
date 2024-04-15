const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3001; // Puedes cambiar este puerto si es necesario

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'emails'
});


db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado a la base de datos MySQL');
});

app.post('/correos', (req, res) => {
  const correo = req.body.correo;
  const sql = 'INSERT INTO correos (correo) VALUES (?)';
  db.query(sql, [correo], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al agregar el correo' });
    } else {
      res.status(200).json({ message: 'Correo agregado correctamente' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
