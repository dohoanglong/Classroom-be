import Courses from './../controllers/course.controller';
import express from 'express';
import passport from 'passport';
var router = express.Router();
// Create a new Course

//To validate request joinning class by email link if validated -> get user into class
router.get('/joinClass', Courses.validateJoinningRequestByEmail);

//To validate request joinning class by invitation link if validated -> get user into classs
router.get(
  '/joinClassByLink',
  passport.authenticate('jwt', { session: false }),
  Courses.validateJoinningRequestByLink
);

router.get(
  '/getGradeStructure/:courseId',
  passport.authenticate('jwt', { session: false }),
  Courses.getGradeStructure
);

router.post(
  '/updateGradeStructure',
  passport.authenticate('jwt', { session: false }),
  Courses.updateGradeStructure
);

//To restore soft-deleted class
router.post('/restore/:courseId', Courses.restore);
//create course, user who created will become teacher of that course
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  Courses.create
);



//send invitation link via email (only teachers and subteacher of class can invite users)
router.post(
  '/sendInvitation',
  passport.authenticate('jwt', { session: false }),
  Courses.sendInvitationLink
);

//create invitation link, everyone who clicked is able to join class (only teachers and subteacher of class can invite users)
router.post(
  '/createInvitationLink',
  passport.authenticate('jwt', { session: false }),
  Courses.createInvitationLink
);



// Retrieve all Courses of a specific user
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  Courses.findAllByUser
);

// Retrieve a single Course with courseId
router.get(
  '/:courseId',
  passport.authenticate('jwt', { session: false }),
  Courses.findOne
);

router.get(
  '/courseInfoFromToken/:token',
  passport.authenticate('jwt', { session: false }),
  Courses.getCourseInfoFromToken
);

// Update a Course with courseId
router.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  Courses.update
);

// Delete a Course with courseId
router.delete('/:courseId', Courses.delete);

export default router;
