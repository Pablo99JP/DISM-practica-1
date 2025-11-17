const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rutas
const usuariosRoutes = require('./routes/usuariosRoutes');
const fichajesRoutes = require('./routes/fichajesRoutes');
const trabajosRoutes = require('./routes/trabajosRoutes');

//Importar conexion a la base de datos
const db = require('./config/db');

// Crear la aplicación Express
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); //Permite que las apps Ionic se conecten con el backend
app.use(bodyParser.json()); //Para leer JSON en las peticiones
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Registro Horario funcionando correctamente'});
});

// Registar las rutas
app.use('/api', usuariosRoutes);
app.use('/api', fichajesRoutes);
app.use('/api', trabajosRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});