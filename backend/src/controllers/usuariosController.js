const db = require('../config/db');

//GET /usuarios - Obtener todos los usuarios
exports.getUsuarios = (req, res) => {
    db.query('SELECT IdUsuario, Nombre, Usuario FROM usuarios', (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

//GET /usuarios/:id - Obtener un usuario por ID
exports.getUsuarioById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT IdUsuarios, Nombre, Usuarios FROM usuarios Where IDUsuarios=?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(results[0]);
    });
};

//POST /usuarios - Crear un nuevo usuario
exports.createUsuarios = (req, res) => {
    const { Nombre, Usuario, Clave } = req.body;

    if (!Nombre) {
        return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    db.query('INSERT INTO usuarios (Nombre, Usuario, Clave) VALUES (?, ?, ?)', [Nombre, Usuario, Clave], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al crear el usuario' });
        }
        res.status(201).json({
            IdUsuario: results.insertId,
            Nombre,
            Usuario
        });
    });
};

//PUT /usuarios/:id - Actualizar un usuario existente
exports.updateUsuarios = (req, res) => {
    const { id } = req.params;
    const { Nombre, Usuario, Clave } = req.body;

    db.query('UPDATE usuarios SET Nombre = ?, Usuario = ?, Clave = ? WHERE IdUsuario = ?', [Nombre, Usuario, Clave, Id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado correctamente' });
    });
};

//DELETE /usuarios/:id - Eliminar un usuario
exports.deleteUsuarios = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM usuarios WHERE IdUsuario = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el usuario' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    });
};