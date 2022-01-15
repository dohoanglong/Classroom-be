import sequelize from './db.js'
import { Sequelize } from 'sequelize'

var Notification = sequelize.define(
    'notification',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        courseId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            field: 'course_id',
        },
        userId: {
            allowNull: true,
            type: Sequelize.INTEGER,
            field: 'user_id',
        },
        type: {
            allowNull: true,
            type: Sequelize.INTEGER,
            field: 'type',
        },
        message: {
            allowNull: false,
            type: Sequelize.STRING,
            field: 'message',
        },
        readed: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            field: 'readed',
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

export default Notification
