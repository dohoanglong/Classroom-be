import mysql from 'mysql';
import dbConfig from '../config/config.js';
import dotenv from 'dotenv'
dotenv.config();

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
  // host: process.end.DB_HOST,
  // user: process.end.DB_USER,
  // password: process.end.DB_PASSWORD,
  // database: process.end.DB
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

export default connection;