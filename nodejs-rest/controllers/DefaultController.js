/**
 * The DefaultController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/DefaultService');
const apikeyGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.apikeyGET);
};

const apikeyIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.apikeyIdDELETE);
};

const apikeyIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.apikeyIdGET);
};

const apikeyIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.apikeyIdPUT);
};

const apikeyPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.apikeyPOST);
};

const fichajesGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesGET);
};

const fichajesIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesIdDELETE);
};

const fichajesIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesIdGET);
};

const fichajesIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesIdPUT);
};

const fichajesPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.fichajesPOST);
};

const trabajosGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.trabajosGET);
};

const trabajosIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.trabajosIdDELETE);
};

const trabajosIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.trabajosIdGET);
};

const trabajosIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.trabajosIdPUT);
};

const trabajosPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.trabajosPOST);
};

const usuariosGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.usuariosGET);
};

const usuariosIdDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.usuariosIdDELETE);
};

const usuariosIdGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.usuariosIdGET);
};

const usuariosIdPUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.usuariosIdPUT);
};

const usuariosPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.usuariosPOST);
};


module.exports = {
  apikeyGET,
  apikeyIdDELETE,
  apikeyIdGET,
  apikeyIdPUT,
  apikeyPOST,
  fichajesGET,
  fichajesIdDELETE,
  fichajesIdGET,
  fichajesIdPUT,
  fichajesPOST,
  trabajosGET,
  trabajosIdDELETE,
  trabajosIdGET,
  trabajosIdPUT,
  trabajosPOST,
  usuariosGET,
  usuariosIdDELETE,
  usuariosIdGET,
  usuariosIdPUT,
  usuariosPOST,
};
