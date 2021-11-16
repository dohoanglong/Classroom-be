import Course from '../models/course.model'

// Create and Save a new Course
class course {
    static create = async (req, res) => {
        // Validate request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        // Create a Course
        const course = {
            name: req.body.name,
            subject: req.body.subject,
            image: req.body.image,
            description: req.body.description,
            createdAt: Date(),
            updatedAt: Date()
        };

        // Save Course in the database
        const newRecord = await Course.create(course);
        res.send(newRecord);
    };

    // Retrieve all Courses from the database.
    static findAll = async (req, res) => {
        try {
            const courses = await Course.findAll();
            res.send(courses);
        } catch (error) {
            console.log(error.message)
        }
    };

    // Find a single Course with a courseId
    static findOne = async (req, res) => {
        try {
            const course = await Course.findOne({ where: { id: req.params.courseId } });

            if (course) {
                res.send(course);
            } else {
                res.status(404).send({
                    message: `Not found Course with id ${req.params.courseId}.`
                });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: "Error retrieving Course with id " + req.params.courseId
            });
        }
    };

    // Update a Course identified by the courseId in the request
    static update = async (req, res) => {
        // Validate Request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }
        try {
            const course = await Course.update(req.body, {
                where: {
                    id: req.body.id,
                },
                returning: true,        //<<<<< To return back updated record instead of success value
                plain: true             // <<<< To return object itself, not return other messy data
            })
            if (course) {
                res.send(course[1].dataValues);     //<<< to get actual object
            } else {
                res.status(404).send({
                    message: `Not found Course with id ${req.body.id}.`
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "Error updating Course with id " + req.body.id
            });
        }
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
