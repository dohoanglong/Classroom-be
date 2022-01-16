import sequelize from './db.js'
import { Sequelize } from 'sequelize'

var OtpMail = sequelize.define(
    'otp_mail',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        otp: {
            allowNull: false,
            type: Sequelize.STRING,
            field: 'otp',
        },
        mail: {
            allowNull: false,
            type: Sequelize.STRING,
            field: 'mail',
        },
        
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            field: 'created_at',
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            field: 'updated_at',
        },
    },
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        paranoid: true, // <<< Apply soft-deleted record
    }
)


export default OtpMail;