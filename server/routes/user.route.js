import Users from './../controllers/user.controller';
import express from 'express';
var router = express.Router();
// Create a new Course

router.post('/', Users.create);
router.post('/login', Users.findOne);
router.post('/authSocial', Users.authSocial);
router.get('/', Users.findAll);
router.delete('/', Users.delete);

export default router;
