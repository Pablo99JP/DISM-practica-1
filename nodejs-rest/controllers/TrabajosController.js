const db = require('../config/db');

// Listar trabajos
exports.getTrabajos = (req, res) => {
  db.query('SELECT * FROM Trabajos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Obtener por ID
exports.getTrabajoById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM Trabajos WHERE IdTrabajo = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).json({ message: 'Trabajo no encontrado' });
    res.json(results[0]);
  });
};

// Crear trabajo
exports.createTrabajo = (req, res) => {
  const { Nombre } = req.body;
  db.query('INSERT INTO Trabajos (Nombre) VALUES (?)', [Nombre], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ IdTrabajo: results.insertId, Nombre });
  });
};

// Actualizar trabajo
exports.updateTrabajo = (req, res) => {
  const id = req.params.id;
  const { Nombre } = req.body;
  db.query('UPDATE Trabajos SET Nombre = ? WHERE IdTrabajo = ?', [Nombre, id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Trabajo actualizado correctamente' });
  });
};

// Eliminar trabajo
exports.deleteTrabajo = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Trabajos WHERE IdTrabajo = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Trabajo eliminado correctamente' });
  });
};
