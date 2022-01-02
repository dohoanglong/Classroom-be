import sequelize from './db.js'
import bcrypt from 'bcrypt'
import { Sequelize } from 'sequelize'

var AdminAccount = sequelize.define(
    'admin_account',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        userName: {
            allowNull: false,
            type: Sequelize.STRING,
            field: 'user_name',
        },
        password: {
            allowNull: false,
            type: Sequelize.STRING,
            field: 'password',
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING,
            field: 'name',
        },
        age: {
            allowNull: true,
            type: Sequelize.INTEGER,
            field: 'age',
        },
        mail: {
            allowNull: true,
            type: Sequelize.STRING,
            field: 'mail',
        },
        phoneNumber: {
            allowNull: true,
            type: Sequelize.STRING,
            field: 'phone_number',
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

AdminAccount.generateHash = (password) => {
    return bcrypt.hash(password, bcrypt.genSaltSync(10))
}

AdminAccount.isValidPassword = (password, currentPassword) => {
    return bcrypt.compare(password, currentPassword)
}

export default AdminAccount;
