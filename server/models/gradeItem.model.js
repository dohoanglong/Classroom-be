import sequelize from './db.js'
import { Sequelize } from 'sequelize'

var GradeItem = sequelize.define(
    'grade_item',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        gradeId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            field: 'grade_id',
        },
        gradeStructureId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            field: 'grade_structure_id',
        },
        score: {
            allowNull: false,
            type: Sequelize.DOUBLE,
            field: 'score',
        },
        isFinal: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            field: 'is_final',
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

export default GradeItem