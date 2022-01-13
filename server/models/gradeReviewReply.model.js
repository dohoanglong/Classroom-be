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

GradeReviewReply.getAll = async (gradeReviewId) => {
    const selectQuery = `
    select
    grade_review_reply.*,
    account.name,
    (CASE WHEN grade_review.student_id = grade_review_reply.user_id THEN 'Student'
              ELSE 'Teacher' END) AS role
from
    grade_review_reply
    join account on account.id = grade_review_reply.user_id
    join grade_review on grade_review.id = grade_review_reply.grade_review_id
where
    grade_review_reply.grade_review_id = ?`

    return sequelize.query(selectQuery, {
        replacements: [gradeReviewId],
        model: GradeReviewReply,
        mapToModel: true,
        raw: true,
    })
}

export default GradeReviewReply;