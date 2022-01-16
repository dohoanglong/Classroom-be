import OtpMailController from '../controllers/otpMailController'
import express from 'express'
import passport from 'passport'
var router = express.Router()



router.post(
    '/',
    OtpMailController.add
)

router.post(
    '/registerOtp',
    OtpMailController.registerOtp
)


export default router;
