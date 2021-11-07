import Courses from './../controllers/course.controller'
import express from 'express';
var router = express.Router();
// Create a new Course

router.post("/", Courses.create);

// Retrieve all Courses
router.get("/", Courses.findAll);

// Retrieve a single Course with courseId
router.get("/:courseId", Courses.findOne);

// Update a Course with courseId
router.put("/:courseId", Courses.update);

// Delete a Course with courseId
router.delete("/:courseId", Courses.delete);

// Create a new Course
router.delete("/", Courses.deleteAll);

export default router;