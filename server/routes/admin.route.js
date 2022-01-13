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
                    res.status(200).send(info)
                    // res.end(info.message)
                    return
                }
                req.user = user
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
                    res.status(200).send(info)
                    // res.end(info.message)
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

router.get('/getClassDetail/:courseId',
    passport.authenticate('jwt', { session: false }),
    AdminController.getClassDetail);

router.get('/getAllClasses',
    passport.authenticate('jwt', { session: false }),
    AdminController.getAllClasses);

router.get('/getUserDetail/:userId',
    passport.authenticate('jwt', { session: false }),
    AdminController.getUserDetail);

router.get('/getAllUsers',
    passport.authenticate('jwt', { session: false }),
    AdminController.getAllUsers);

router.get('/getAdminDetail/:userName',
    passport.authenticate('jwt', { session: false }),
    AdminController.getAdminDetail);

router.get('/getAllAdmins',
    passport.authenticate('jwt', { session: false }),
    AdminController.getAllAdmins);

router.post('/banUser',
    passport.authenticate('jwt', { session: false }),
    AdminController.banUser);

router.post('/unbanUser',
    passport.authenticate('jwt', { session: false }),
    AdminController.unbanUser);

router.post('/toggleStudentId',
    passport.authenticate('jwt', { session: false }),
    AdminController.toggleStudentId);

    router.get('/',
    passport.authenticate('jwt', { session: false }),
    AdminController.getInforAdmin);

export default router;
