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
router.post(
  '/signin',
  userValidator.signInValidator,
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.redirect('/users/signin');
      }

      req.logIn(user, (err) => {
        if (err) return next(err);

        // Now req.user exists and you can redirect dynamically
        return res.redirect(`/users/${user.id}`);
      });
    })(req, res, next);
  }
);
router.get('/signout', userController.signOut);
router.get('/:id', userController.showUserPage);

export default router;