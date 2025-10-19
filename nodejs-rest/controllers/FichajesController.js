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
// ✅ MODIFICADO: Ahora devuelve el fichaje completo recién creado
exports.createFichaje = (req, res) => {
  const { FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud } = req.body;
  
  db.query(
    'INSERT INTO Fichajes (FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud],
    (err, results) => {
      if (err) return res.status(500).send(err);
      
      // 🔍 Obtener el fichaje recién insertado para devolverlo
      const nuevoId = results.insertId;
      db.query('SELECT * FROM Fichajes WHERE IdFichaje = ?', [nuevoId], (err2, fichaje) => {
        if (err2) return res.status(500).send(err2);
        res.status(201).json(fichaje[0]); // ✅ Devuelve el fichaje completo
      });
    }
  );
};

// Actualizar fichaje
// ✅ MODIFICADO: Ahora devuelve el fichaje completo actualizado
exports.updateFichaje = (req, res) => {
  const id = req.params.id;
  const { FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud } = req.body;

  db.query(
    `UPDATE Fichajes SET  FechaHoraSalida=?, HorasTrabajadas=?, IdTrabajo=?, IdUsuario=?, GeolocalizacionLatitud=?, GeolocalizacionLongitud=? WHERE IdFichaje=?`,
    [ FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud, id],
    (err) => {
      if (err) return res.status(500).send(err);
      
      // 🔍 Obtener el fichaje actualizado para devolverlo
      db.query('SELECT * FROM Fichajes WHERE IdFichaje = ?', [id], (err2, fichaje) => {
        if (err2) return res.status(500).send(err2);
        if (fichaje.length === 0) return res.status(404).json({ message: 'Fichaje no encontrado' });
        res.json(fichaje[0]); // ✅ Devuelve el fichaje completo actualizado
      });
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