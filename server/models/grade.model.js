import sequelize from './db.js'
import { Sequelize } from 'sequelize'
import GradeItem from './gradeItem.model.js'

var Grade = sequelize.define(
    'grade',
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
            allowNull: false,
            type: Sequelize.INTEGER,
            field: 'student_id',
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

Grade.getClassGrade = async (courseId) => {
    const selectQuery = `
    SELECT account.id,
       account.name,
       account.student_id,
       grade_item.grade_structure_id,
       grade_item.score,
       grade_item.is_final
    FROM   grade_item
       JOIN grade
         ON grade.id = grade_item.grade_id
       JOIN account
         ON account.id = grade.student_id
    WHERE  grade.course_id = ? `

    return sequelize.query(selectQuery, {
        replacements: [courseId],
        model: GradeItem,
        mapToModel: true,
        raw: true,
    })
}

export default Grade