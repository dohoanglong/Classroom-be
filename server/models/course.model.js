import sequelize from './db.js';
<<<<<<< HEAD
import Sequelize from 'sequelize'
=======
import {Sequelize} from 'sequelize'
>>>>>>> 71d0e011de47d983d309ef362100838f18db9261

var Course = sequelize.define('course', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    name: {
        allowNull: false,
      type: Sequelize.STRING,
      field: 'first_name'
    },
    subject: {
        allowNull: false,
      type: Sequelize.STRING,
      field: 'subject'
    },
    image: {   
      type: Sequelize.STRING,
      field: 'image'
    },
    description: {
      type: Sequelize.STRING,
      field: 'description'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'created_at'
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'updated_at'
    }  
  }, {
<<<<<<< HEAD
    freezeTableName: true // Model tableName will be the same as the model name
  });

=======
    freezeTableName: true, // Model tableName will be the same as the model name
    paranoid: true      // <<< Apply soft-deleted record
  });
>>>>>>> 71d0e011de47d983d309ef362100838f18db9261
export default Course;