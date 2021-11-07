import sql from './db.js';

// constructor
const Course = function (course) {
    this.id = course.id;
    this.name = course.name;
    this.subject = course.subject;
    this.image = course.image;
    this.description = course.description;
};

Course.create = (newCourse, result) => {
    sql.query("INSERT INTO courses SET ?", newCourse, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created course: ", { id: res.insertId, ...newCourse });
        result(null, { id: res.insertId, ...newCourse });
    });
};

Course.findById = (courseId, result) => {
    sql.query(`SELECT * FROM courses WHERE id = ${courseId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found course: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found course with the id
        result({ kind: "not_found" }, null);
    });
};

Course.getAll = result => {
    sql.query("SELECT * FROM courses", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("courses: ", res);
        result(null, res);
    });
};

Course.updateById = (id, course, result) => {
    sql.query(
        "UPDATE courses SET name = ?, subject = ?,image = ?, description = ? WHERE id = ?",
        [...course, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found course with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated course: ", { id: id, ...course });
            result(null, { id: id, ...course });
        }
    );
};

Course.remove = (id, result) => {
    sql.query("DELETE FROM courses WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found course with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted course with id: ", id);
        result(null, res);
    });
};

Course.removeAll = result => {
    sql.query("DELETE FROM courses", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} courses`);
        result(null, res);
    });
};

export default Course;