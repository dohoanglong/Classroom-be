import Users from './../controllers/user.controller';
import express from 'express';
var router = express.Router();
import passport from 'passport'
// Create a new Course

router.post('/',passport.authenticate('jwt', { session: false }), Users.create);
router.post('/login', Users.findOne);
router.post('/authSocial', Users.authSocial);
router.get('/',passport.authenticate('jwt', { session: false }), Users.getUserDetail);
router.delete('/',passport.authenticate('jwt', { session: false }), Users.delete);

export default router;
