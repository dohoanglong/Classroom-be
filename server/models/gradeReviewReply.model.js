import sequelize from './db.js'
import { Sequelize } from 'sequelize'

var GradeReviewReply = sequelize.define(
    'grade_review_reply',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        gradeReviewId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            field: 'grade_review_id',
        },
        userId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            field: 'user_id',
        },
        comment: {
            allowNull: false,
            type: Sequelize.STRING,
            field: 'comment',
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

export default GradeReviewReply;