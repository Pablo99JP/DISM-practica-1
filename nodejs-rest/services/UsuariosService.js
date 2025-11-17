/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Crear un nuevo usuario
*
* usuarioInput UsuarioInput 
* returns Usuario
* */
const createUsuario = ({ usuarioInput }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        usuarioInput,
      }));
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
      resolve(Service.successResponse({
        id,
      }));
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
      resolve(Service.successResponse({
        id,
      }));
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
      resolve(Service.successResponse({
      }));
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
      resolve(Service.successResponse({
        id,
        usuarioInput,
      }));
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
