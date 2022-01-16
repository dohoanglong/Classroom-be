import sequelize from './db.js'
import { Sequelize } from 'sequelize'

var GradeReview = sequelize.define(
    'grade_review',
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
            allowNull: false,
            type: Sequelize.INTEGER,
            field: 'user_id',
        },
        studentId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            field: 'student_id',
        },
        gradeItemId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            field: 'grade_item_id',
        },
        expectationScore: {
            allowNull: false,
            type: Sequelize.DOUBLE,
            field: 'expectation_score',
        },
        explanation: {
            allowNull: false,
            type: Sequelize.STRING,
            field: 'explanation',
        },
        status: {
            allowNull: false,
            type: Sequelize.STRING(7),
            field: 'status',
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

GradeReview.getAll = async (courseId) => {
    const selectQuery = `select
    grade_review.*,
    account.name,
    grade_item.title
from
    grade_review
    join grade_item on  grade_item.id = grade_review.grade_item_id
    join account on account.id = grade_review.user_id 
where
    grade_review.course_id = ?`

    return sequelize.query(selectQuery, {
        replacements: [courseId],
        model: GradeReview,
        mapToModel: true,
        raw: true,
    })
}

GradeReview.getDetailById = async (id) => {
    const selectQuery = `
    select
    grade_review.*,
    account.name,
    grade_item.title,
    grade_item.score as currentScore
from
    grade_review
    join grade_item on  grade_item.id = grade_review.grade_item_id
    join account on account.id = grade_review.user_id 
where
    grade_review.id = ?`

    return sequelize.query(selectQuery, {
        replacements: [id],
        model: GradeReview,
        mapToModel: true,
        raw: true,
    })
}

GradeReview.getDetail = async (courseId) => {
    const selectQuery = `
    SELECT account.id,
       grade.student_id,
       grade.student_name,
       grade_item.grade_structure_id,
       grade_item.title,
       grade_item.score,
       grade_item.is_final
    FROM grade_item
       JOIN grade
         ON grade.id = grade_item.grade_id
       LEFT JOIN account
         ON account.student_id = grade.student_id
    WHERE grade.course_id = ?`

    return sequelize.query(selectQuery, {
        replacements: [courseId],
        model: GradeReview,
        mapToModel: true,
        raw: true,
    })
}

export default GradeReview;