const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rutas
const usuariosRoutes = require('./routes/usuariosRoutes');
const trabajosRoutes = require('./routes/trabajosRoutes');
const fichajesRoutes = require('./routes/fichajesRoutes');

app.use('/', usuariosRoutes);
app.use('/', trabajosRoutes);
app.use('/', fichajesRoutes);

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});


const launchServer = async () => {
  try {
    this.expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML);
    this.expressServer.launch();
    logger.info('Express server running');
  } catch (error) {
    logger.error('Express Server failure', error.message);
    await this.close();
  }
};

// Iniciar el servidor
launchServer().catch(e => logger.error(e));

// Conexión a la base de datos MySQL
const mysql = require('mysql');
const dbConfig = require('./config/db.config');
const connection = mysql.createConnection(dbConfig);
connection.connect(error => {
  if (error) throw error;
  console.log("¡Conexión MySQL establecida!");
});
