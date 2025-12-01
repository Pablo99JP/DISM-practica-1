/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('../db');

/**
* Crear un nuevo fichaje
*
* fichajeInput FichajeInput 
* returns Fichaje
* */
const createFichaje = (params) => new Promise(
  async (resolve, reject) => {
    try {
      // Aceptar tanto fichajeInput como body directamente
      const data = params.fichajeInput || params.body || params;
      const { FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud } = data;
      const [result] = await db.query(
        'INSERT INTO Fichajes (FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) VALUES (?, ?, ?, ?, ?)',
        [FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud]
      );
      resolve(Service.successResponse({
        IdFichaje: result.insertId,
        FechaHoraEntrada,
        FechaHoraSalida: null,
        HorasTrabajadas: null,
        IdTrabajo,
        IdUsuario,
        GeolocalizacionLatitud,
        GeolocalizacionLongitud
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
* usuario Integer Filtrar por ID de usuario (optional)
* desde date Fecha inicial (YYYY-MM-DD) (optional)
* hasta date Fecha final (YYYY-MM-DD) (optional)
* returns List
* */
const getFichajes = ({ usuario, desde, hasta }) => new Promise(
  async (resolve, reject) => {
    try {
      let query = 'SELECT f.*, t.Nombre AS NombreTrabajo, u.NombreUsuario FROM Fichajes f LEFT JOIN Trabajos t ON f.IdTrabajo = t.IdTrabajo LEFT JOIN Usuarios u ON f.IdUsuario = u.IdUsuario WHERE 1=1';
      const params = [];

      if (usuario) {
        query += ' AND f.IdUsuario = ?';
        params.push(usuario);
      }

      if (desde) {
        query += ' AND DATE(f.FechaHoraEntrada) >= ?';
        params.push(desde);
      }

      if (hasta) {
        query += ' AND DATE(f.FechaHoraEntrada) <= ?';
        params.push(hasta);
      }

      query += ' ORDER BY f.FechaHoraEntrada DESC';

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