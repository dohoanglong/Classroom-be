import NotificationController from '../controllers/notificationController'
import express from 'express'
import passport from 'passport'
var router = express.Router()



router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    NotificationController.getAllNotification
)

router.put('/',
    passport.authenticate('jwt', { session: false }),
    NotificationController.markReadedAll
    )

router.post('/',
    passport.authenticate('jwt', { session: false }),
    NotificationController.createFinalizedNotifications
)


export default router;
