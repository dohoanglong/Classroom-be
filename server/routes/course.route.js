import CourseController from './../controllers/course.controller'
import express from 'express'
import passport from 'passport'
var router = express.Router()
// Create a new Course

//To validate request joinning class by email link if validated -> get user into class
router.get('/joinClass', CourseController.validateJoinningRequestByEmail)

//To validate request joinning class by invitation link if validated -> get user into classs
router.get(
    '/joinClassByLink',
    passport.authenticate('jwt', { session: false }),
    CourseController.validateJoinningRequestByLink
)

router.get(
    '/getGradeStructure/:courseId',
    passport.authenticate('jwt', { session: false }),
    CourseController.getGradeStructure
)

router.post(
    '/updateGradeStructure',
    passport.authenticate('jwt', { session: false }),
    CourseController.updateGradeStructure
)

//To restore soft-deleted class
router.post('/restore/:courseId', CourseController.restore)
//create course, user who created will become teacher of that course
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    CourseController.create
)

//send invitation link via email (only teachers and subteacher of class can invite users)
router.post(
    '/sendInvitation',
    passport.authenticate('jwt', { session: false }),
    CourseController.sendInvitationLink
)

//create invitation link, everyone who clicked is able to join class (only teachers and subteacher of class can invite users)
router.post(
    '/createInvitationLink',
    passport.authenticate('jwt', { session: false }),
    CourseController.createInvitationLink
)

// Retrieve all course of a specific user
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    CourseController.findAllByUser
)

// Retrieve a single Course with courseId
router.get(
    '/:courseId',
    passport.authenticate('jwt', { session: false }),
    CourseController.findOne
)

router.get(
    '/courseInfoFromToken/:token',
    passport.authenticate('jwt', { session: false }),
    CourseController.getCourseInfoFromToken
)

// Update a Course with courseId
router.put(
    '/',
    passport.authenticate('jwt', { session: false }),
    CourseController.update
)

// Delete a Course with courseId
router.delete('/:courseId', CourseController.delete)

export default router;
