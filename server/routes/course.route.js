import Courses from './../controllers/course.controller'
import express from 'express';
import passport from 'passport';
var router = express.Router();
// Create a new Course

router.post("/", Courses.create);

// Retrieve all Courses
router.get("/",passport.authenticate('jwt', { session: false }),  Courses.findAll);

// Retrieve a single Course with courseId
router.get("/:courseId", Courses.findOne);

// Update a Course with courseId
router.put("/", Courses.update);

// Delete a Course with courseId
router.delete("/:courseId", Courses.delete);


export default router;