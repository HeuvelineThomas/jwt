const Sequelize = require('sequelize')
const mysql = require('mysql2')

const connection = mysql.createConnection({host : "localhost", port : "3306", user : "root", password : ""});
    
connection.query('CREATE DATABASE IF NOT EXISTS `jwt`;')

const sequelize = new Sequelize('jwt', 'root', '', 
    {
        dialect: 'mysql',
        host: 'localhost',
        define : {freezeTableName: true}
    }
);

try {
    sequelize;
    console.log("ça marche")
} catch (error) {
    console.error("marche pas", error)
}

// createConnection();

module.exports = sequelize