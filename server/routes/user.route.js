import Users from './../controllers/user.controller';
import express from 'express';
var router = express.Router();
import passport from 'passport'
// Create a new Course

router.post('/',passport.authenticate('jwt', { session: false }), Users.create);
router.post('/login', Users.findOne);
router.post('/authSocial', Users.authSocial);
router.post('/mapStudentId',passport.authenticate('jwt', { session: false }), Users.mapStudentIdToAccount);
router.get('/',passport.authenticate('jwt', { session: false }), Users.getUserDetail);
router.post('/getUserInClass',passport.authenticate('jwt', { session: false }), Users.getUserInClass);
router.delete('/',passport.authenticate('jwt', { session: false }), Users.delete);

export default router;
