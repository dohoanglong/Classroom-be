import sequelize from './db.js';
import { Sequelize } from 'sequelize';

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
      field: 'first_name',
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
);
export default Course;
