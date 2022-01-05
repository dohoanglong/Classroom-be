import sequelize from './db.js'
import { Sequelize } from 'sequelize'
import UsersCourses from './usersCourses.model.js'

var Course = sequelize.define(
    'course',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING,
            field: 'name',
        },
        subject: {
            allowNull: false,
            type: Sequelize.STRING,
            field: 'subject',
        },
        image: {
            type: Sequelize.STRING,
            field: 'image',
        },
        description: {
            type: Sequelize.STRING,
            field: 'description',
        },
        gradeStructure: {
            type: Sequelize.STRING(99999),
            field: 'grade_structure',
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

Course.findCoursesByUserId = async (userId) => {
    const selectQuery = `
  SELECT distinct(course.id, users_courses.teacher_id),
      course.*,
      (CASE
          WHEN ?= users_courses.student_id THEN 'student'
          WHEN ? = users_courses.teacher_id THEN 'teacher'
          WHEN ? = users_courses.subteacher_id THEN 'sub-teacher'
      END) AS ROLE
  FROM users_courses
  JOIN course 
      ON course.id = users_courses.course_id
  WHERE users_courses.student_id=?
      OR users_courses.subteacher_id=?
      OR users_courses.teacher_id=?`

    return sequelize.query(selectQuery, {
        replacements: Array(6).fill(userId),
        model: UsersCourses,
        mapToModel: true,
        raw: true,
    })
}

export default Course
