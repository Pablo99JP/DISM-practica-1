/**
 * SERVIDOR EXPRESS CON OPENAPI/SWAGGER
 * =====================================
 * Esta clase configura y lanza el servidor Express con:
 * - Validación automática de requests según especificación OpenAPI
 * - Documentación interactiva (Swagger UI)
 * - Middleware para CORS, body parsing, cookies, etc.
 * 
 * OpenAPI (antes Swagger):
 * - Estándar para definir APIs REST
 * - Genera documentación automática
 * - Valida requests/responses automáticamente
 */

// const { Middleware } = require('swagger-express-middleware');
const http = require('http');
const fs = require('fs');
const path = require('path');
const swaggerUI = require('swagger-ui-express');     // UI interactiva para probar API
const jsYaml = require('js-yaml');                   // Parser de archivos YAML
const express = require('express');                  // Framework web
const cors = require('cors');                        // Cross-Origin Resource Sharing
const cookieParser = require('cookie-parser');       // Parser de cookies
const bodyParser = require('body-parser');           // Parser del body de requests
const OpenApiValidator = require('express-openapi-validator');  // Validador OpenAPI
const logger = require('./logger');
const config = require('./config');

/**
 * Clase que encapsula la configuración del servidor Express
 */
class ExpressServer {
  /**
   * Constructor del servidor
   * @param {number} port - Puerto donde escuchará el servidor
   * @param {string} openApiYaml - Ruta al archivo de especificación OpenAPI
   */
  constructor(port, openApiYaml) {
    this.port = port;
    this.app = express();
    this.openApiPath = openApiYaml;
    
    // Cargar y parsear especificación OpenAPI
    try {
      this.schema = jsYaml.safeLoad(fs.readFileSync(openApiYaml));
    } catch (e) {
      logger.error('failed to start Express Server', e.message);
    }
    
    this.setupMiddleware();
  }

  /**
   * Configurar middleware de Express
   * 
   * Middleware: Funciones que se ejecutan en el flujo request → response
   * - Se ejecutan en orden de declaración
   * - Pueden modificar req/res o finalizar la request
   */
  setupMiddleware() {
    // CORS: Permitir requests desde otros dominios (frontend en localhost:8100)
    this.app.use(cors());
    
    // Body parsers: Convertir body de requests a JSON
    this.app.use(bodyParser.json({ limit: '14MB' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    
    // Cookie parser: Acceder a cookies en req.cookies
    this.app.use(cookieParser());
    
    // Endpoint de prueba simple
    this.app.get('/hello', (req, res) => res.send(`Hello World. path: ${this.openApiPath}`));
    
    // Servir archivo OpenAPI YAML
    this.app.get('/openapi', (req, res) => res.sendFile((path.join(__dirname, 'api', 'openapi.yaml'))));
    
    // Documentación interactiva Swagger UI (accesible en /api-docs)
    this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(this.schema));
    
    // Endpoints para OAuth (si se usa autenticación OAuth2)
    this.app.get('/login-redirect', (req, res) => {
      res.status(200);
      res.json(req.query);
    });
    this.app.get('/oauth2-redirect.html', (req, res) => {
      res.status(200);
      res.json(req.query);
    });
    
    // OpenAPI Validator: Valida automáticamente requests según la especificación
    // - Verifica tipos de datos, campos requeridos, formatos, etc.
    // - Enruta requests a los handlers definidos en controllers
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: this.openApiPath,
        operationHandlers: path.join(__dirname),  // Carpeta con controllers
        fileUploader: { dest: config.FILE_UPLOAD_PATH },
      }),
    );
  }

  /**
   * Lanzar el servidor HTTP
   * 
   * - Configura error handler global
   * - Crea servidor HTTP con la app Express
   * - Escucha en el puerto configurado
   */
  launch() {
    // Error handler global (debe ser el último middleware)
    // Este middleware captura todos los errores de la aplicación
    // eslint-disable-next-line no-unused-vars
    this.app.use((err, req, res, next) => {
      // Formatear y enviar error al cliente
      res.status(err.status || 500).json({
        message: err.message || err,
        errors: err.errors || '',  // Detalles de validación de OpenAPI
      });
    });

    // Crear servidor HTTP y escuchar en el puerto
    http.createServer(this.app).listen(this.port);
    console.log(`Listening on port ${this.port}`);
  }

  /**
   * Cerrar servidor gracefully
   * Útil para tests o shutdown controlado
   */
  async close() {
    if (this.server !== undefined) {
      await this.server.close();
      console.log(`Server on port ${this.port} shut down`);
    }
  }
}

module.exports = ExpressServer;
