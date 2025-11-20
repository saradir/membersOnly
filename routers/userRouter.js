import express from 'express';
import * as userController from '../controllers/userController.js';
import * as userValidator from '../validators/userValidator.js';

const router = express.Router();


router.get('/', (req, res) => {
  res.send('yo');});
router.get('/signup', userController.showSignupForm);
router.post('/signup', userValidator.signUpValidator, userController.processSignup);
router.get('/signin', userController.showSigninForm);
router.post('/signin', userController.processSignin);

export default router;