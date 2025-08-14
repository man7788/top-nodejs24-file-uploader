const db = require('../prisma/queries');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const nameErr = 'must be between 1 and 255 characters.';
const emailErr = 'format is not correct.';
const passwordErr = 'must be between 1 and 64 characters.';
const confirmErr = 'do not match.';

const validateUser = [
  body('email')
    .trim()
    .isEmail()
    .withMessage(`Email ${emailErr}`)
    .isLength({ min: 1, max: 255 })
    .withMessage(`Email ${nameErr}`)
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 1, max: 64 })
    .withMessage(`Password ${passwordErr}`)
    .escape(),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`Passwords ${confirmErr}`)
    .escape(),
];

// Index Controllers
exports.getIndex = async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/main');
  } else {
    res.render('login', { title: 'Log In' });
  }
};

// Sign-up Controllers
exports.getSignup = async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/main');
  }
  res.render('sign-up', { title: 'Sign Up' });
};

exports.postSignup = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render('sign-up', { title: 'Sign Up', errors: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await db.createUser(req.body.email, hashedPassword);

    res.send(user);
  },
];

// Log-in Controllers
exports.getLogin = async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/main');
  }
  res.render('login', { title: 'Log In' });
};

// Main Controllers
exports.getMain = async (req, res) => {
  res.render('main', { title: 'Main' });
};
