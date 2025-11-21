import express from 'express';
import * as userController from '../controllers/userController.js';
import * as userValidator from '../validators/userValidator.js';
import passport from '../config/passport.js';
const router = express.Router();


router.get('/', (req, res) => {
  res.send('yo');});
router.get('/signup', userController.showSignupForm);
router.post('/signup', userValidator.signUpValidator, userController.processSignup);
router.get('/signin', userController.showSigninForm);
router.post('/signin', userValidator.signInValidator,  passport.authenticate("local", {
    successRedirect: "/",
    failureMessage: true,
    failureRedirect: "/users/signin"
  }));
router.get('/signout', userController.signOut);

export default router;