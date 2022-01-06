import GradereviewController from '../controllers/gradeReviewController.controller'
import express from 'express'
import passport from 'passport'
var router = express.Router()

router.post(
    '/add',
    passport.authenticate('jwt', { session: false }),
    GradereviewController.add
)

router.post(
    '/remove',
    passport.authenticate('jwt', { session: false }),
    GradereviewController.remove
)

router.post(
    '/updateScoreAndStatus',
    passport.authenticate('jwt', { session: false }),
    GradereviewController.updateScoreAndStatus
)

router.post(
    '/addComment',
    passport.authenticate('jwt', { session: false }),
    GradereviewController.addComment
)

router.get(
    '/get/:gradeReviewId',
    passport.authenticate('jwt', { session: false }),
    GradereviewController.get
)

router.get(
    '/getAll/:courseId',
    passport.authenticate('jwt', { session: false }),
    GradereviewController.getAll
)

export default router;
