const express = require('express');
const router = express.Router();
const fichajesController = require('../controllers/fichajesController');

// Rutas para Fichajes
router.get('/fichajes', fichajesController.getFichajes);
router.get('/fichajes/:id', fichajesController.getFichajeById);
router.post('/fichajes', fichajesController.createFichaje);
router.put('/fichajes/:id', fichajesController.updateFichaje);
router.delete('/fichajes/:id', fichajesController.deleteFichaje);

module.exports = router;