import express from 'express'
import passport from 'passport'
var router = express.Router()
import auth from '../controllers/auth.controller'

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
                    res.status(401)
                    res.end(info.message)
                    return
                }
                next()
            }
        )(req, res, next)
    },
    auth.register
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
                    res.status(401)
                    res.end(info.message)
                    return
                }
                req.user = user.dataValues
                req.user.password = null
                next()
            }
        )(req, res, next)
    },
    auth.login
)

router.post('/socialLogin', auth.socialLogin)
router.get('/logout', auth.logout)

export default router
