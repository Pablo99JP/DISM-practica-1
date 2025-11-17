const express = require('express');
const router = express.Router();
const trabajosController = require('../controllers/trabajosController');

// Rutas para Trabajos
router.get('/trabajos', trabajosController.getTrabajos);
router.get('/trabajos/:id', trabajosController.getTrabajoById);
router.post('/trabajos', trabajosController.createTrabajo);
router.put('/trabajos/:id', trabajosController.updateTrabajo);
router.delete('/trabajos/:id', trabajosController.deleteTrabajo);

module.exports = router;