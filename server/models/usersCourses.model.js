import sequelize from './db.js'
import { Sequelize } from 'sequelize'

var UsersCourses = sequelize.define(
    'users_courses',
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
        studentId: {
            allowNull: true,
            type: Sequelize.INTEGER,
            field: 'student_id',
        },
        teacherId: {
            type: Sequelize.INTEGER,
            field: 'teacher_id',
        },
        subTeacherId: {
            allowNull: true,
            type: Sequelize.INTEGER,
            field: 'subteacher_id',
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

export default UsersCourses
