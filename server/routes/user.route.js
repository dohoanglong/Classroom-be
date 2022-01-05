import UserController from './../controllers/user.controller'
import express from 'express'
var router = express.Router()
import passport from 'passport'
// Create a new Course

router.post('/', passport.authenticate('jwt', { session: false }), UserController.create)
router.put('/', passport.authenticate('jwt', { session: false }), UserController.update)
router.post('/login', UserController.findOne)
router.post('/authSocial', UserController.authSocial)
router.post(
    '/mapStudentId',
    passport.authenticate('jwt', { session: false }),
    UserController.mapStudentIdToAccount
)
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    UserController.getUserDetail
)
router.post(
    '/getUserInClass',
    passport.authenticate('jwt', { session: false }),
    UserController.getUserInClass
)
router.delete(
    '/',
    passport.authenticate('jwt', { session: false }),
    UserController.delete
)

export default router
