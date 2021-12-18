import GradeController from '../controllers/grade.controller'
import express from 'express'
import passport from 'passport'
var router = express.Router()


router.get(
    '/getClassGrade/:courseId',
    passport.authenticate('jwt', { session: false }),
    GradeController.getClassGrade
)

router.post(
    '/updateStudentGrade',
    passport.authenticate('jwt', { session: false }),
    GradeController.updateStudentGrade
)

router.post(
    '/updateClassGrade',
    passport.authenticate('jwt', { session: false }),
    GradeController.updateClassGrade
)

export default router;
