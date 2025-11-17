/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('../db');

/**
* Crear un nuevo usuario
*
* usuarioInput UsuarioInput 
* returns Usuario
* */
const createUsuario = ({ usuarioInput }) => new Promise(
  async (resolve, reject) => {
    try {
      const { Nombre, Usuario, Clave } = usuarioInput;
      const [result] = await db.query(
        'INSERT INTO Usuarios (Nombre, Usuario, Clave) VALUES (?, ?, ?)',
        [Nombre, Usuario, Clave]
      );
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
* no response value expected for this operation
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
* usuarioInput UsuarioInput 
* no response value expected for this operation
* */
const updateUsuario = ({ id, usuarioInput }) => new Promise(
  async (resolve, reject) => {
    try {
      const { Nombre, Usuario, Clave } = usuarioInput;
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