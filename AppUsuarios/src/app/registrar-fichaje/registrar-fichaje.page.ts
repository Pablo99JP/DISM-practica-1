const db = require('../config/db');

// 🔧 FUNCIÓN: Convertir fecha ISO a formato MySQL local
function isoToMySQLLocal(isoString) {
  if (!isoString) return null;
  
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 🔧 FUNCIÓN: Convertir fecha MySQL a formato local para el cliente
function mysqlToLocalFormat(mysqlDate) {
  if (!mysqlDate) return null;
  
  // MySQL devuelve algo como "2025-10-19T10:06:12.000Z"
  // Lo convertimos a Date y luego a formato ISO pero sin conversión UTC
  const date = new Date(mysqlDate);
  
  // Obtener componentes en hora LOCAL
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  // Devolver en formato ISO pero CON la hora local (sin Z al final)
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

// 🔧 FUNCIÓN: Formatear un fichaje antes de devolverlo al cliente
function formatearFichaje(fichaje) {
  return {
    ...fichaje,
    FechaHoraEntrada: mysqlToLocalFormat(fichaje.FechaHoraEntrada),
    FechaHoraSalida: mysqlToLocalFormat(fichaje.FechaHoraSalida)
  };
}

// Listar fichajes
exports.getFichajes = (req, res) => {
  db.query('SELECT * FROM Fichajes', (err, results) => {
    if (err) return res.status(500).send(err);
    
    // ✅ Formatear todas las fechas antes de devolver
    const fichajesFormateados = results.map(formatearFichaje);
    res.json(fichajesFormateados);
  });
};

// Obtener fichaje por ID
exports.getFichajeById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM Fichajes WHERE IdFichaje = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).json({ message: 'Fichaje no encontrado' });
    
    // ✅ Formatear fechas antes de devolver
    res.json(formatearFichaje(results[0]));
  });
};

// Crear fichaje
exports.createFichaje = (req, res) => {
  const { FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud } = req.body;
  
  // ✅ Convertir fechas a formato MySQL local
  const entradaMySQL = isoToMySQLLocal(FechaHoraEntrada);
  const salidaMySQL = isoToMySQLLocal(FechaHoraSalida);
  
  console.log('📝 CREATE - Fecha recibida:', FechaHoraEntrada);
  console.log('📝 CREATE - Fecha convertida para MySQL:', entradaMySQL);
  
  db.query(
    'INSERT INTO Fichajes (FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [entradaMySQL, salidaMySQL, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud],
    (err, results) => {
      if (err) return res.status(500).send(err);
      
      const nuevoId = results.insertId;
      db.query('SELECT * FROM Fichajes WHERE IdFichaje = ?', [nuevoId], (err2, fichaje) => {
        if (err2) return res.status(500).send(err2);
        
        console.log('✅ CREATE - Fichaje guardado (raw):', fichaje[0]);
        
        // ✅ Formatear fechas antes de devolver
        const fichajeFormateado = formatearFichaje(fichaje[0]);
        console.log('✅ CREATE - Fichaje formateado:', fichajeFormateado);
        
        res.status(201).json(fichajeFormateado);
      });
    }
  );
};

// Actualizar fichaje
exports.updateFichaje = (req, res) => {
  const id = req.params.id;
  const { FechaHoraEntrada, FechaHoraSalida, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud } = req.body;

  // ✅ Convertir fechas a formato MySQL local
  const entradaMySQL = isoToMySQLLocal(FechaHoraEntrada);
  const salidaMySQL = isoToMySQLLocal(FechaHoraSalida);
  
  console.log('📝 UPDATE - Entrada recibida:', FechaHoraEntrada);
  console.log('📝 UPDATE - Entrada convertida:', entradaMySQL);
  console.log('📝 UPDATE - Salida recibida:', FechaHoraSalida);
  console.log('📝 UPDATE - Salida convertida:', salidaMySQL);

  db.query(
    `UPDATE Fichajes SET FechaHoraEntrada=?, FechaHoraSalida=?, HorasTrabajadas=?, IdTrabajo=?, IdUsuario=?, GeolocalizacionLatitud=?, GeolocalizacionLongitud=? WHERE IdFichaje=?`,
    [entradaMySQL, salidaMySQL, HorasTrabajadas, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud, id],
    (err) => {
      if (err) return res.status(500).send(err);
      
      db.query('SELECT * FROM Fichajes WHERE IdFichaje = ?', [id], (err2, fichaje) => {
        if (err2) return res.status(500).send(err2);
        if (fichaje.length === 0) return res.status(404).json({ message: 'Fichaje no encontrado' });
        
        console.log('✅ UPDATE - Fichaje actualizado (raw):', fichaje[0]);
        
        // ✅ Formatear fechas antes de devolver
        const fichajeFormateado = formatearFichaje(fichaje[0]);
        console.log('✅ UPDATE - Fichaje formateado:', fichajeFormateado);
        
        res.json(fichajeFormateado);
      });
    }
  );
};

// Eliminar fichaje
exports.deleteFichaje = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM Fichajes WHERE IdFichaje = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Fichaje eliminado correctamente' });
  });
};