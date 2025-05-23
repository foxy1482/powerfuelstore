const dotenv = require('dotenv');

dotenv.configDotenv();
/* BASE DE DATOS  */


const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'tienda'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos!');
});
module.exports = connection;