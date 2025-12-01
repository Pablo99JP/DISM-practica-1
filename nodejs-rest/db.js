/**
 * MÓDULO DE CONEXIÓN A BASE DE DATOS
 * ===================================
 * Este archivo configura el pool de conexiones a MySQL usando mysql2/promise.
 * 
 * ¿Qué es un pool de conexiones?
 * - Es un conjunto reutilizable de conexiones a la base de datos
 * - Mejora el rendimiento al evitar crear/cerrar conexiones constantemente
 * - Gestiona automáticamente las conexiones disponibles
 */

const mysql = require('mysql2/promise');

// Crear pool de conexiones con configuración
const pool = mysql.createPool({
    host: 'localhost',              // Servidor donde está MySQL
    user: 'root',                   // Usuario de MySQL
    password: '',                   // Contraseña (vacía en entorno local)
    database: 'registro_horario',   // Nombre de la base de datos
    waitForConnections: true,       // Esperar si no hay conexiones disponibles
    connectionLimit: 10,            // Máximo 10 conexiones simultáneas
    queueLimit: 0                   // Sin límite de peticiones en cola
});

// Exportar el pool para usarlo en otros archivos
module.exports = pool;