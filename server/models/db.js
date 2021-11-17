import { Pool } from 'pg'
<<<<<<< HEAD
import Sequelize from 'sequelize'
=======
import {Sequelize} from 'sequelize'
>>>>>>> 71d0e011de47d983d309ef362100838f18db9261
import dotenv from 'dotenv'
dotenv.config();

// Create a connection to the database
const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}

var sequelize = new Sequelize({
  database: process.env.DB,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // <<<<<<< YOU NEED THIS
    }
  },
});
const pool = new Pool(databaseConfig);


<<<<<<< HEAD
=======
const pool = new Pool(databaseConfig);


>>>>>>> 71d0e011de47d983d309ef362100838f18db9261
export default sequelize;