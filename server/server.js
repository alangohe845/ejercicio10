const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alangomez845@gmail.com', 
    pass: 'mxgm zkbf sjec jumn' 
  }
});

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
 

app.post('/login', (req, res) => {
  const { user, pass } = req.body;
  const sql = 'SELECT * FROM users WHERE user = ? AND pass = ?';
  db.query(sql, [user, pass], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al verificar las credenciales' });
    } else {
      if (result.length > 0) {
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
      } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
      }
    }
  });
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

app.put('/correos/:id', (req, res) => {
  const idCorreo = req.params.id;
  const nuevoCorreo = req.body.correo; 
  const sql = 'UPDATE correos SET correo = ? WHERE id = ?';
  db.query(sql, [nuevoCorreo, idCorreo], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al actualizar el correo' });
    } else {
      res.status(200).json({ message: 'Correo actualizado correctamente' });
    }
  });
});

app.get('/correos', (req, res) => {
  const sql = 'SELECT id, correo FROM correos';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener los correos' });
    } else {
      res.status(200).json(result); 
    }
  });
});


app.post('/notas', async (req, res) => {
  const { titulo, descripcion } = req.body;
  const sql = 'INSERT INTO notas (titulo, descripcion) VALUES (?, ?)';
  db.query(sql, [titulo, descripcion], async (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al agregar la nota' });
    } else {
      res.status(200).json({ message: 'Nota agregada correctamente' });

      const obtenerCorreosSQL = 'SELECT correo FROM correos';
      db.query(obtenerCorreosSQL, async (err, correosResult) => {
        if (err) {
          console.error('Error al obtener los correos registrados:', err);
          return;
        }

        const correos = correosResult.map(row => row.correo);

        const mailOptions = {
          from: 'alangomez845@gmail.com', 
          to: correos,
          subject: 'Nueva notificacion',
          text: `Titulo: ${titulo}, y descripción: ${descripcion}`
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log('Correo enviado a todos los correos registrados');
        } catch (error) {
          console.error('Error al enviar el correo:', error);
        }
      });
    }
  });
});


app.get('/notas', (req, res) => {
  const sql = 'SELECT * FROM notas';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener las notas' });
    } else {
      res.status(200).json(result);
    }
  });
});


app.delete('/notas/:id', (req, res) => {
  const idNota = req.params.id;
  const sql = 'DELETE FROM notas WHERE id = ?';
  db.query(sql, [idNota], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar la nota' });
    } else {
      res.status(200).json({ message: 'Nota eliminada correctamente' });
    }
  });
});

app.delete('/correos/:id', (req, res) => {
  const idCorreo = req.params.id;
  const sql = 'DELETE FROM correos WHERE id = ?';
  db.query(sql, [idCorreo], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar el correo' });
    } else {
      res.status(200).json({ message: 'Correo eliminada correctamente' });
    }
  });
});

app.put('/notas/:id', (req, res) => {
  const idNota = req.params.id;
  const { titulo, descripcion } = req.body;
  const sql = 'UPDATE notas SET titulo = ?, descripcion = ? WHERE id = ?';
  db.query(sql, [titulo, descripcion, idNota], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error al editar la nota' });
    } else {
      res.status(200).json({ message: 'Nota editada correctamente' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
