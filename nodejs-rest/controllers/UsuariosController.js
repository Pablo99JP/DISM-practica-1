const db = require('../config/db');

// Obtener todos los usuarios
exports.getUsuarios = (req, res) => {
  db.query('SELECT * FROM Usuarios', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Obtener usuario por ID
exports.getUsuarioById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(results[0]);
  });
};

// Crear usuario
exports.createUsuario = (req, res) => {
  const { Nombre, Usuario, Clave } = req.body;
  if (!Nombre) return res.status(400).json({ message: 'Nombre es obligatorio' });

  db.query(
    'INSERT INTO Usuarios (Nombre, Usuario, Clave) VALUES (?, ?, ?)',
    [Nombre, Usuario, Clave],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ IdUsuario: results.insertId, Nombre, Usuario });
    }
  );
};

// Actualizar usuario
exports.updateUsuario = (req, res) => {
  const id = req.params.id;
  const { Nombre, Usuario, Clave } = req.body;

  db.query(
    'UPDATE Usuarios SET Nombre = ?, Usuario = ?, Clave = ? WHERE IdUsuario = ?',
    [Nombre, Usuario, Clave, id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Usuario actualizado correctamente' });
    }
  );
};

// Eliminar usuario
exports.deleteUsuario = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Usuarios WHERE IdUsuario = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Usuario eliminado correctamente' });
  });
};
