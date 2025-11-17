const db = require('../config/db');

// GET /trabajos - Obtener todos los trabajos
exports.getTrabajos = (req, res) => {
    db.query('SELECT * FROM Trabajos', (err, results) => {
        if (err) {
            console.error('Error al obtener trabajos:', err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// GET /trabajos/:id - Obtener un trabajo por ID
exports.getTrabajoById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Trabajos WHERE IdTrabajo = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Trabajo no encontrado' });
        }
        res.json(results[0]);
    });
};

// POST /trabajos - Crear un nuevo trabajo
exports.createTrabajo = (req, res) => {
    const { Nombre } = req.body;

    if (!Nombre) {
        return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    db.query('INSERT INTO Trabajos (Nombre) VALUES (?)', [Nombre], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al crear trabajo' });
        }
        res.status(201).json({
            IdTrabajo: results.insertId,
            Nombre
        });
    });
};

// PUT /trabajos/:id - Actualizar un trabajo
exports.updateTrabajo = (req, res) => {
    const { id } = req.params;
    const { Nombre } = req.body;

    db.query(
        'UPDATE Trabajos SET Nombre = ? WHERE IdTrabajo = ?',
        [Nombre, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error al actualizar trabajo' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Trabajo no encontrado' });
            }
            res.json({ message: 'Trabajo actualizado correctamente' });
        }
    );
};

// DELETE /trabajos/:id - Eliminar un trabajo
exports.deleteTrabajo = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM Trabajos WHERE IdTrabajo = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar trabajo' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Trabajo no encontrado' });
        }
        res.json({ message: 'Trabajo eliminado correctamente' });
    });
};