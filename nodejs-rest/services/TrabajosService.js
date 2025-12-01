/**
 * SERVICIO DE GESTIÓN DE TRABAJOS
 * ================================
 * Este módulo maneja las operaciones CRUD para trabajos/proyectos.
 * Los trabajos son las tareas o proyectos donde los usuarios fichean.
 * 
 * Patrón utilizado: Repository Pattern
 * - Separa la lógica de negocio de la capa de acceso a datos
 * - Facilita testing y mantenimiento
 */

/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('../db');

/**
 * Crear un nuevo trabajo
 * 
 * @param {Object} params - Datos del trabajo
 * @returns {Promise} Promise con el trabajo creado
 * 
 * Los trabajos son simples: solo tienen un nombre
 * Podrían extenderse con: descripción, fecha inicio/fin, presupuesto, etc.
 */
const createTrabajo = (params) => new Promise(
  async (resolve, reject) => {
    try {
      const data = params.trabajoInput || params.body || params;
      const { Nombre } = data;
      
      // INSERT simple con un solo campo
      const [result] = await db.query(
        'INSERT INTO Trabajos (Nombre) VALUES (?)',
        [Nombre]
      );
      
      resolve(Service.successResponse({
        IdTrabajo: result.insertId,
        Nombre
      }, 201));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Eliminar un trabajo
*
* id Integer 
* no response value expected for this operation
* */
const deleteTrabajo = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      await db.query('DELETE FROM Trabajos WHERE IdTrabajo = ?', [id]);
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
* Obtener un trabajo por ID
*
* id Integer 
* returns Trabajo
* */
const getTrabajoById = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query('SELECT * FROM Trabajos WHERE IdTrabajo = ?', [id]);
      if (rows.length === 0) {
        reject(Service.rejectResponse('Trabajo no encontrado', 404));
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
* Obtener todos los trabajos
*
* returns List
* */
const getTrabajos = () => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query('SELECT * FROM Trabajos');
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
* Actualizar un trabajo
*
* id Integer 
* trabajoInput TrabajoInput 
* no response value expected for this operation
* */
const updateTrabajo = (params) => new Promise(
  async (resolve, reject) => {
    try {
      const { id } = params;
      const data = params.trabajoInput || params.body || params;
      const { Nombre } = data;
      await db.query(
        'UPDATE Trabajos SET Nombre = ? WHERE IdTrabajo = ?',
        [Nombre, id]
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
  createTrabajo,
  deleteTrabajo,
  getTrabajoById,
  getTrabajos,
  updateTrabajo,
};