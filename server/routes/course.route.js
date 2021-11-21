import Courses from './../controllers/course.controller';
import express from 'express';
import passport from 'passport';
var router = express.Router();
// Create a new Course

router.get('/joinClass', Courses.validateJoinningRequestByEmail);
router.get(
  '/joinClassByLink',
  passport.authenticate('jwt', { session: false }),
  Courses.validateJoinningRequestByLink
);
router.post('/restore/:courseId', Courses.restore);
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  Courses.create
);

router.post('/sendInvitation', Courses.sendInvitationLink);
router.post('/createInvitationLink', Courses.createInvitationLink);

// Retrieve all Courses
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  Courses.findAll
);

// Retrieve a single Course with courseId
router.get('/:courseId', Courses.findOne);

// Update a Course with courseId
router.put('/', Courses.update);

// Delete a Course with courseId
router.delete('/:courseId', Courses.delete);

export default router;
