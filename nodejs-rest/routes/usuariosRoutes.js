const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/UsuariosController');

router.get('/usuarios', usuariosController.getUsuarios);
router.get('/usuarios/:id', usuariosController.getUsuarioById);
router.post('/usuarios', usuariosController.createUsuario);
router.put('/usuarios/:id', usuariosController.updateUsuario);
router.delete('/usuarios/:id', usuariosController.deleteUsuario);

module.exports = router;
