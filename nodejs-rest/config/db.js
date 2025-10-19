const mysql = require('mysql2');
const dbConfig = require('./db.config');

const connection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
   timezone: '+02:00'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

module.exports = connection;