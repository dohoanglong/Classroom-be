import sequelize from './db.js'
import bcrypt from 'bcrypt'
import { Sequelize } from 'sequelize'
import UsersCourses from './usersCourses.model.js'

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

AdminAccount.getAllAdminAccount = async (courseId) => {
    const selectQuery = `
  SELECT distinct(account.id, users_courses.course_id, account.name, account.mail),
        account.id,
        users_courses.course_id,
        account.name,
        account.mail,
        (CASE WHEN account.id = users_courses.student_id THEN 'student'
              WHEN account.id = users_courses.teacher_id THEN 'teacher'
              WHEN account.id = users_courses.subteacher_id THEN 'sub-teacher' END) AS role
  FROM users_courses
        JOIN account ON account.id = users_courses.teacher_id
        OR account.id = users_courses.subteacher_id
        OR account.id = users_courses.student_id
  WHERE course_id= ?`

    return sequelize.query(selectQuery, {
        replacements: [courseId],
        model: UsersCourses,
        mapToModel: true,
        raw: true,
    })
}

export default AdminAccount;
