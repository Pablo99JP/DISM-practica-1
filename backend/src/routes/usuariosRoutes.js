const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Rutas para usuarios
router.get('/usuarios', usuariosController.getUsuarios);
router.get('/usuarios/:id', usuariosController.getUsuarioById);
router.post('/usuarios', usuariosController.createUsuarios);
router.put('/usuarios/:id', usuariosController.updateUsuarios);
router.delete('/usuarios/:id', usuariosController.deleteUsuarios);

module.exports = router;