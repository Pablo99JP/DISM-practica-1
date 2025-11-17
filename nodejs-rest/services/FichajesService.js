/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Crear un nuevo fichaje
*
* fichajeInput FichajeInput 
* returns Fichaje
* */
const createFichaje = ({ fichajeInput }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        fichajeInput,
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
* Eliminar un fichaje
*
* id Integer 
* no response value expected for this operation
* */
const deleteFichaje = ({ id }) => new Promise(
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
* Obtener un fichaje por ID
*
* id Integer 
* returns Fichaje
* */
const getFichajeById = ({ id }) => new Promise(
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
* Obtener fichajes con filtros opcionales
*
* usuario Integer Filtrar por ID de usuario (optional)
* desde date Fecha inicial (YYYY-MM-DD) (optional)
* hasta date Fecha final (YYYY-MM-DD) (optional)
* returns List
* */
const getFichajes = ({ usuario, desde, hasta }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        usuario,
        desde,
        hasta,
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
* Actualizar un fichaje
*
* id Integer 
* fichajeUpdate FichajeUpdate 
* no response value expected for this operation
* */
const updateFichaje = ({ id, fichajeUpdate }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        fichajeUpdate,
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
  createFichaje,
  deleteFichaje,
  getFichajeById,
  getFichajes,
  updateFichaje,
};
