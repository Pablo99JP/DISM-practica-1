const db = require('../config/db');

// GET /fichajes - Obtener fichajes con filtros opcionales
exports.getFichajes = (req, res) => {
    const { usuario, desde, hasta } = req.query;

    let query = 'SELECT * FROM Fichajes WHERE 1=1';
    const params = [];

    // Filtrar por usuario si se proporciona
    if (usuario) {
        query += ' AND IdUsuario = ?';
        params.push(usuario);
    }

    // Filtrar por rango de fechas
    if (desde) {
        query += ' AND FechaHoraEntrada >= ?';
        params.push(desde);
    }
    if (hasta) {
        query += ' AND FechaHoraEntrada <= ?';
        params.push(hasta);
    }

    query += ' ORDER BY FechaHoraEntrada DESC';

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al obtener fichajes:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// GET /fichajes/:id - Obtener un fichaje por ID
exports.getFichajeById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Fichajes WHERE IdFichaje = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Fichaje no encontrado' });
        }
        res.json(results[0]);
    });
};

// POST /fichajes - Crear un nuevo fichaje (iniciar fichaje)
exports.createFichaje = (req, res) => {
    const {
        FechaHoraEntrada,
        IdTrabajo,
        IdUsuario,
        GeolocalizacionLatitud,
        GeolocalizacionLongitud
    } = req.body;

    db.query(
        'INSERT INTO Fichajes (FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) VALUES (?, ?, ?, ?, ?)',
        [FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud],
        (err, results) => {
            if (err) {
                console.error('Error al crear fichaje:', err);
                return res.status(500).json({ message: 'Error al crear fichaje' });
            }

            // Devolver el fichaje recién creado
            db.query('SELECT * FROM Fichajes WHERE IdFichaje = ?', [results.insertId], (err2, fichaje) => {
                if (err2) {
                    return res.status(201).json({ IdFichaje: results.insertId });
                }
                res.status(201).json(fichaje[0]);
            });
        }
    );
};

// PUT /fichajes/:id - Actualizar un fichaje (cerrar fichaje)
exports.updateFichaje = (req, res) => {
    const { id } = req.params;
    const {
        FechaHoraEntrada,
        FechaHoraSalida,
        HorasTrabajadas,
        IdTrabajo,
        IdUsuario,
        GeolocalizacionLatitud,
        GeolocalizacionLongitud
    } = req.body;

    db.query(
        `UPDATE Fichajes 
     SET FechaHoraEntrada = ?, FechaHoraSalida = ?, HorasTrabajadas = ?, 
         IdTrabajo = ?, IdUsuario = ?, 
         GeolocalizacionLatitud = ?, GeolocalizacionLongitud = ? 
     WHERE IdFichaje = ?`,
        [FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario,
            GeolocalizacionLatitud, GeolocalizacionLongitud, id],
        (err, results) => {
            if (err) {
                console.error('Error al actualizar fichaje:', err);
                return res.status(500).json({ message: 'Error al actualizar fichaje' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Fichaje no encontrado' });
            }

            // Devolver el fichaje actualizado
            db.query('SELECT * FROM Fichajes WHERE IdFichaje = ?', [id], (err2, fichaje) => {
                if (err2) {
                    return res.json({ message: 'Fichaje actualizado correctamente' });
                }
                res.json(fichaje[0]);
            });
        }
    );
};

// DELETE /fichajes/:id - Eliminar un fichaje
exports.deleteFichaje = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Fichajes WHERE IdFichaje = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar fichaje' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Fichaje no encontrado' });
        }
        res.json({ message: 'Fichaje eliminado correctamente' });
    });
};