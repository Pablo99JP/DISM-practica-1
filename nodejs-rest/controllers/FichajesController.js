const db = require('../config/db');

// Listar fichajes
exports.getFichajes = (req, res) => {
  db.query('SELECT * FROM Fichajes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Obtener fichaje por ID
exports.getFichajeById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM Fichajes WHERE IdFichaje = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).json({ message: 'Fichaje no encontrado' });
    res.json(results[0]);
  });
};

// Crear fichaje
exports.createFichaje = (req, res) => {
  const { FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud } = req.body;
  db.query(
    'INSERT INTO Fichajes (FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ IdFichaje: results.insertId });
    }
  );
};

// Actualizar fichaje
exports.updateFichaje = (req, res) => {
  const id = req.params.id;
  const { FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud } = req.body;

  db.query(
    `UPDATE Fichajes SET FechaHoraEntrada=?, FechaHoraSalida=?, HorasTrabajadas=?, IdTrabajo=?, IdUsuario=?, GeolocalizacionLatitud=?, GeolocalizacionLongitud=? WHERE IdFichaje=?`,
    [FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Fichaje actualizado correctamente' });
    }
  );
};

// Eliminar fichaje
exports.deleteFichaje = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Fichajes WHERE IdFichaje = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Fichaje eliminado correctamente' });
  });
};
