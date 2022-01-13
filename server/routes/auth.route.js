import express from 'express'
import passport from 'passport'
var router = express.Router()
import AuthController from '../controllers/auth.controller'

router.post(
    '/register',
    function (req, res, next) {
        passport.authenticate(
            'register',
            { session: false },
            function (err, user, info) {
                if (err) {
                    return next(err)
                }
                if (!user) {
                    res.status(200).send(info)
                    // res.end(info)
                    return
                }
                next()
            }
        )(req, res, next)
    },
    AuthController.register
)

router.post(
    '/login',
    function (req, res, next) {
        passport.authenticate(
            'login',
            { session: false },
            function (err, user, info) {
                if (err) {
                    return next(err)
                }
                if (!user) {
                    res.status(200).send(info)
                    // res.end(info)
                    return
                }
                req.user = user.dataValues
                req.user.password = null
                next()
            }
        )(req, res, next)
    },
    AuthController.login
)

router.post('/renewPassword',AuthController.renewPassword)
router.post('/changePassword',passport.authenticate('jwt', { session: false }) ,AuthController.changePassword)
router.post('/socialLogin', AuthController.socialLogin)
router.get('/logout', AuthController.logout)

export default router
