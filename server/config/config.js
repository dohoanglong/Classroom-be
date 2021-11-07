import dotenv from 'dotenv'
dotenv.config();

export default {
    HOST: process.end.DB_HOST,
    USER: process.end.DB_USER,
    PASSWORD: process.end.DB_PASSWORD,
    DB: process.env.DB
};