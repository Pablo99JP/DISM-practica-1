/**
 * PUNTO DE ENTRADA DE LA API REST
 * ================================
 * Este es el archivo principal que inicia el servidor Express.
 * 
 * Flujo de ejecución:
 * 1. Carga la configuración del servidor (puerto, rutas, etc.)
 * 2. Inicializa el logger para registrar eventos
 * 3. Crea una instancia del servidor Express
 * 4. Lanza el servidor en el puerto configurado
 */

const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');

/**
 * Función asíncrona para iniciar el servidor
 * - async/await permite manejar operaciones asíncronas de forma más legible
 * - try/catch captura errores durante el inicio
 */
const launchServer = async () => {
  try {
    // Crear instancia del servidor con puerto y especificación OpenAPI
    this.expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML);
    
    // Iniciar el servidor (escuchar en el puerto configurado)
    this.expressServer.launch();
    
    // Registrar mensaje de éxito
    logger.info('Express server running');
  } catch (error) {
    // Si hay error, registrarlo y cerrar gracefully
    logger.error('Express Server failure', error.message);
    await this.close();
  }
};

// Ejecutar la función y capturar errores no manejados
launchServer().catch(e => logger.error(e));
