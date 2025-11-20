import { body } from 'express-validator';

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 20 characters.";

export const signUpValidator = [

  body('first_name')
    .trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage(`First name ${lengthErr}`),

  body('last_name')
    .trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage(`Last name ${lengthErr}`),

  body('email').isEmail().withMessage('Must be a valid email address'),

  body('password').isLength({ min: 8 }).withMessage('Password must have at least 8 characters'),

  body('password2').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

export const signInValidator = [
    body('email')
    .trim()
    .isEmail(),

    body('password').notEmpty()
]
