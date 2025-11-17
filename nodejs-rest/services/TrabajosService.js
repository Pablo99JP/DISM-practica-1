/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Crear un nuevo trabajo
*
* trabajoInput TrabajoInput 
* returns Trabajo
* */
const createTrabajo = ({ trabajoInput }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        trabajoInput,
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
* Eliminar un trabajo
*
* id Integer 
* no response value expected for this operation
* */
const deleteTrabajo = ({ id }) => new Promise(
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
* Obtener un trabajo por ID
*
* id Integer 
* returns Trabajo
* */
const getTrabajoById = ({ id }) => new Promise(
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
* Obtener todos los trabajos
*
* returns List
* */
const getTrabajos = () => new Promise(
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
* Actualizar un trabajo
*
* id Integer 
* trabajoInput TrabajoInput 
* no response value expected for this operation
* */
const updateTrabajo = ({ id, trabajoInput }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
        trabajoInput,
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
  createTrabajo,
  deleteTrabajo,
  getTrabajoById,
  getTrabajos,
  updateTrabajo,
};
