const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database: 'registro_horario'
});

connection.connect((err) => {
    if(err){
        console.error('Error conectando a MYSQL:', err);
        return;
    }
    console.log('Conectado a MYSQL');
});

module.exports=connection;