import Course from '../models/course.model'

// Create and Save a new Course
class course {
    static create = (req, res) => {
        // Validate request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        // Create a Course
        const course = new Course({
            id: req.body.id,
            name: req.body.name,
            subject: req.body.subject,
            image: req.body.image,
            description: req.body.description
        });

        // Save Course in the database
        Course.create(course, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the course."
                });
            else res.send(data);
        });
    };

    // Retrieve all Courses from the database.
    static findAll = (req, res) => {
        Course.getAll((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving courses."
                });
            else res.send(data);
        });
    };

    // Find a single Course with a courseId
    static findOne = (req, res) => {
        Course.findById(req.params.courseId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Course with id ${req.params.courseId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving Course with id " + req.params.courseId
                    });
                }
            } else res.send(data);
        });
    };

    // Update a Course identified by the courseId in the request
    static update = (req, res) => {
        // Validate Request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        console.log(req.body);

        Course.updateById(
            req.params.courseId,
            new Course(req.body),
            (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found Course with id ${req.params.courseId}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating Course with id " + req.params.courseId
                        });
                    }
                } else res.send(data);
            }
        );
    };

    // Delete a Course with the specified courseId in the request
    static delete = (req, res) => {
        Course.remove(req.params.courseId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Course with id ${req.params.courseId}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Could not delete Course with id " + req.params.courseId
                    });
                }
            } else res.send({ message: `Course was deleted successfully!` });
        });
    };

    // Delete all Courses from the database.
    static deleteAll = (req, res) => {
        Course.removeAll((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while removing all courses."
                });
            else res.send({ message: `All Courses were deleted successfully!` });
        });
    };
}

export default course;
