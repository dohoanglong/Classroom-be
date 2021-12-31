import express from 'express'
import passport from 'passport'
import AdminController from '../controllers/admin.controller'
var router = express.Router()

router.post(
    '/create',
    function (req, res, next) {
        passport.authenticate(
            'createAdminAccount',
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
    AdminController.create
)

router.post(
    '/login',
    function (req, res, next) {
        passport.authenticate(
            'loginIntoAdminAccount',
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
    AdminController.logIn
)

export default router
