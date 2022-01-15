import NotificationController from '../controllers/notificationController'
import express from 'express'
import passport from 'passport'
var router = express.Router()



router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
)


export default router;
