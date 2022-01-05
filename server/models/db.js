import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

var sequelize = new Sequelize({
    database: process.env.DB,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
        },
    },
})

export default sequelize
