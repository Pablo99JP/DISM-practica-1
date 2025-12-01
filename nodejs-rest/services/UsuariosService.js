/**
 * SERVICIO DE GESTIÓN DE USUARIOS
 * ================================
 * Este módulo maneja todas las operaciones CRUD para usuarios.
 * 
 * CRUD significa:
 * - Create (Crear): POST /usuarios
 * - Read (Leer): GET /usuarios, GET /usuarios/:id
 * - Update (Actualizar): PUT /usuarios/:id
 * - Delete (Eliminar): DELETE /usuarios/:id
 */

/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('../db');

/**
 * Crear un nuevo usuario
 * 
 * @param {Object} params - Datos del usuario
 * @returns {Promise} Promise con el usuario creado
 * 
 */
const createUsuario = (params) => new Promise(
  async (resolve, reject) => {
    try {
      const data = params.usuarioInput || params.body || params;
      const { Nombre, Usuario, Clave } = data;
      
      // INSERT con prepared statements (? = placeholder)
      const [result] = await db.query(
        'INSERT INTO Usuarios (Nombre, Usuario, Clave) VALUES (?, ?, ?)',
        [Nombre, Usuario, Clave]
      );
      
      // Retornar usuario creado con ID generado
      resolve(Service.successResponse({
        IdUsuario: result.insertId,
        Nombre,
        Usuario,
        Clave
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
* Eliminar un usuario
*
* id Integer 
* 
* */
const deleteUsuario = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      await db.query('DELETE FROM Usuarios WHERE IdUsuario = ?', [id]);
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
* Obtener un usuario por ID
*
* id Integer 
* returns Usuario
* */
const getUsuarioById = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [id]);
      if (rows.length === 0) {
        reject(Service.rejectResponse('Usuario no encontrado', 404));
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
* Obtener todos los usuarios
*
* returns List
* */
const getUsuarios = () => new Promise(
  async (resolve, reject) => {
    try {
      const [rows] = await db.query('SELECT * FROM Usuarios');
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
* Actualizar un usuario
*
* id Integer 
* 
* */
const updateUsuario = (params) => new Promise(
  async (resolve, reject) => {
    try {
      const { id } = params;
      const data = params.usuarioInput || params.body || params;
      const { Nombre, Usuario, Clave } = data;
      await db.query(
        'UPDATE Usuarios SET Nombre = ?, Usuario = ?, Clave = ? WHERE IdUsuario = ?',
        [Nombre, Usuario, Clave, id]
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
  createUsuario,
  deleteUsuario,
  getUsuarioById,
  getUsuarios,
  updateUsuario,
};