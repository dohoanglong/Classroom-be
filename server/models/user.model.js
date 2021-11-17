import sequelize from './db.js';
import Sequelize from 'sequelize';

var User = sequelize.define(
  'user',
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

    image: {
      // allowNull: false,
      type: Sequelize.STRING,
      field: 'image',
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING,
      field: 'password',
    },
    mail: {
      allowNull: false,
      type: Sequelize.STRING,
      field: 'mail',
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
  }
);

export default User;
