import sequelize from './db.js';
import Sequelize from 'sequelize'

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
    freezeTableName: true // Model tableName will be the same as the model name
  });

// Course.create = (newCourse, result) => {
//     sequelize.query("INSERT INTO courses SET ?", newCourse, (err, res) => {
//         if (err) {
//             console.log("error: ", err);
//             result(err, null);
//             return;
//         }

//         console.log("created course: ", { id: res.insertId, ...newCourse });
//         result(null, { id: res.insertId, ...newCourse });
//     });
// };

// Course.findById = (courseId, result) => {
//     sequelize.query(`SELECT * FROM courses WHERE id = ${courseId}`, (err, res) => {
//         if (err) {
//             console.log("error: ", err);
//             result(err, null);
//             return;
//         }

//         if (res.length) {
//             console.log("found course: ", res[0]);
//             result(null, res[0]);
//             return;
//         }

//         // not found course with the id
//         result({ kind: "not_found" }, null);
//     });
// };

// Course.getAll = result => {
//     sequelize.query("SELECT * FROM courses", (err, res) => {
//         if (err) {
//             console.log("error: ", err);
//             result(null, err);
//             return;
//         }

//         console.log("courses: ", res);
//         result(null, res);
//     });
// };

// Course.updateById = (id, course, result) => {
//     sequelize.query(
//         "UPDATE courses SET name = ?, subject = ?,image = ?, description = ? WHERE id = ?",
//         [...course, id],
//         (err, res) => {
//             if (err) {
//                 console.log("error: ", err);
//                 result(null, err);
//                 return;
//             }

//             if (res.affectedRows == 0) {
//                 // not found course with the id
//                 result({ kind: "not_found" }, null);
//                 return;
//             }

//             console.log("updated course: ", { id: id, ...course });
//             result(null, { id: id, ...course });
//         }
//     );
// };

// Course.remove = (id, result) => {
//     sequelize.query("DELETE FROM courses WHERE id = ?", id, (err, res) => {
//         if (err) {
//             console.log("error: ", err);
//             result(null, err);
//             return;
//         }

//         if (res.affectedRows == 0) {
//             // not found course with the id
//             result({ kind: "not_found" }, null);
//             return;
//         }

//         console.log("deleted course with id: ", id);
//         result(null, res);
//     });
// };

// Course.removeAll = result => {
//     sequelize.query("DELETE FROM courses", (err, res) => {
//         if (err) {
//             console.log("error: ", err);
//             result(null, err);
//             return;
//         }

//         console.log(`deleted ${res.affectedRows} courses`);
//         result(null, res);
//     });
// };

export default Course;