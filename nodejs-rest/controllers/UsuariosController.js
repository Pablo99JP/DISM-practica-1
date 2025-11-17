/**
 * The UsuariosController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/UsuariosService');
const createUsuario = async (request, response) => {
  await Controller.handleRequest(request, response, service.createUsuario);
};

const deleteUsuario = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteUsuario);
};

const getUsuarioById = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUsuarioById);
};

const getUsuarios = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUsuarios);
};

const updateUsuario = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateUsuario);
};


module.exports = {
  createUsuario,
  deleteUsuario,
  getUsuarioById,
  getUsuarios,
  updateUsuario,
};
