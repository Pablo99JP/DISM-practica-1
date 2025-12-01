/**
 * SERVICIO DE GESTIÓN DE FICHAJES
 * ================================
 * Este módulo contiene la lógica de negocio para el CRUD de fichajes.
 * Los fichajes registran la entrada y salida de trabajadores en trabajos específicos.
 * 
 * Conceptos importantes:
 * - Promises: Permiten manejar operaciones asíncronas (como consultas a BD)
 * - async/await: Sintaxis moderna para trabajar con Promises
 * - Prepared statements (?): Previenen inyección SQL
 */

/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('../db');

/**
 * Crear un nuevo fichaje (registrar entrada de un trabajador)
 * 
 * @param {Object} params - Parámetros del fichaje
 * @returns {Promise} Promise con el fichaje creado
 * 
 * Flujo:
 * 1. Extrae los datos del fichaje (fecha, trabajo, usuario, geolocalización)
 * 2. Inserta en la base de datos usando prepared statement
 * 3. Retorna el fichaje creado con su ID generado
 */
const createFichaje = (params) => new Promise(
  async (resolve, reject) => {
    try {
      // Aceptar tanto fichajeInput como body directamente (compatibilidad OpenAPI)
      const data = params.fichajeInput || params.body || params;
      
      // Desestructuración: extraer propiedades del objeto data
      const { FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud } = data;
      
      // Ejecutar INSERT con parámetros preparados (previene SQL injection)
      // db.query retorna un array: [resultado, campos]
      const [result] = await db.query(
        'INSERT INTO Fichajes (FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) VALUES (?, ?, ?, ?, ?)',
        [FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud]
      );
      
      // Resolver la promesa con respuesta exitosa (201 = Created)
      resolve(Service.successResponse({
        IdFichaje: result.insertId,  // ID auto-generado por MySQL
        FechaHoraEntrada,
        FechaHoraSalida: null,       // Al crear, aún no hay salida
        HorasTrabajadas: null,
        IdTrabajo,
        IdUsuario,
        GeolocalizacionLatitud,
        GeolocalizacionLongitud
      }, 201));
    } catch (e) {
      // Si hay error, rechazar la promesa con respuesta de error
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Eliminar un fichaje
*
* id Integer 
* no response value expected for this operation
* */
const deleteFichaje = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      await db.query('DELETE FROM Fichajes WHERE IdFichaje = ?', [id]);
      resolve(Service.successResponse({}, 204));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Obtener un fichaje por ID
*
* id Integer 
* returns Fichaje
* */
const getFichajeById = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query(
        'SELECT f.*, t.Nombre AS NombreTrabajo FROM Fichajes f LEFT JOIN Trabajos t ON f.IdTrabajo = t.IdTrabajo WHERE f.IdFichaje = ?',
        [id]
      );
      if (rows.length === 0) {
        reject(Service.rejectResponse('Fichaje no encontrado', 404));
      } else {
        resolve(Service.successResponse(rows[0]));
      }
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
 * Obtener fichajes con filtros opcionales
 * 
 * Esta función construye dinámicamente una consulta SQL según los filtros.
 * 
 * @param {Object} params - Parámetros de búsqueda
 * @param {number} params.usuario - Filtrar por ID de usuario (opcional)
 * @param {string} params.desde - Fecha inicial YYYY-MM-DD (opcional)
 * @param {string} params.hasta - Fecha final YYYY-MM-DD (opcional)
 * @returns {Promise} Promise con array de fichajes
 * 
 * Conceptos SQL aplicados:
 * - LEFT JOIN: Obtener datos relacionados de otras tablas (Trabajos, Usuarios)
 * - WHERE 1=1: Facilita concatenar condiciones dinámicamente
 * - DATE(): Función MySQL para comparar solo la parte de fecha
 * - Prepared statements: Los ? previenen inyección SQL
 */
const getFichajes = ({ usuario, desde, hasta }) => new Promise(
  async (resolve, reject) => {
    try {
      // Query base: SELECT con JOINs para obtener nombres relacionados
      // LEFT JOIN: Si no hay relación, aún muestra el fichaje (con NULL en campos relacionados)
      let query = 'SELECT f.*, t.Nombre AS NombreTrabajo, u.NombreUsuario FROM Fichajes f LEFT JOIN Trabajos t ON f.IdTrabajo = t.IdTrabajo LEFT JOIN Usuarios u ON f.IdUsuario = u.IdUsuario WHERE 1=1';
      const params = [];

      // Construcción dinámica de filtros
      // Solo añadir condiciones si los parámetros existen
      if (usuario) {
        query += ' AND f.IdUsuario = ?';
        params.push(usuario);
      }

      if (desde) {
        // DATE() extrae solo la fecha (ignora la hora)
        query += ' AND DATE(f.FechaHoraEntrada) >= ?';
        params.push(desde);
      }

      if (hasta) {
        query += ' AND DATE(f.FechaHoraEntrada) <= ?';
        params.push(hasta);
      }

      // Ordenar por fecha más reciente primero
      query += ' ORDER BY f.FechaHoraEntrada DESC';

      // Ejecutar query con parámetros preparados
      const [rows] = await db.query(query, params);
      resolve(Service.successResponse(rows));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Actualizar un fichaje
*
* id Integer 
* fichajeUpdate FichajeUpdate 
* no response value expected for this operation
* */
const updateFichaje = (params) => new Promise(
  async (resolve, reject) => {
    try {
      const { id } = params;
      const data = params.fichajeUpdate || params.body || params;
      const { FechaHoraSalida, HorasTrabajadas } = data;
      await db.query(
        'UPDATE Fichajes SET FechaHoraSalida = ?, HorasTrabajadas = ? WHERE IdFichaje = ?',
        [FechaHoraSalida, HorasTrabajadas, id]
      );
      resolve(Service.successResponse({}, 200));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  createFichaje,
  deleteFichaje,
  getFichajeById,
  getFichajes,
  updateFichaje,
};