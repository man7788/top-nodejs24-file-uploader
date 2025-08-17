const db = require('../prisma/queries');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const nameErr = 'must be between 1 and 255 characters.';
const emailErr = 'format is not correct.';
const passwordErr = 'must be between 1 and 64 characters.';
const confirmErr = 'do not match.';

const validateSignup = [
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

const validateLogin = [
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
];

// Index Controllers
exports.getIndex = async (req, res) => {
  console.log(res.locals);
  if (req.isAuthenticated()) {
    res.redirect('/uploader');
  } else {
    res.render('login', { title: 'Log In' });
  }
};

// Sign-up Controllers
exports.getSignup = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/uploader');
  }
  res.render('sign-up', { title: 'Sign Up' });
};

exports.postSignup = [
  validateSignup,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render('sign-up', { title: 'Sign Up', errors: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await db.createUser(req.body.email, hashedPassword);

    await db.createFolder('root', user.id);

    next();
  },
  passport.authenticate('local', {
    successRedirect: '/uploader',
    failureRedirect: '/log-in',
  }),
];

// Log-in Controllers
exports.getLogin = async (req, res) => {
  const errMessages = req.flash('error');
  const errors = [];
  if (errMessages) {
    errMessages.forEach((message) => {
      errors.push({ msg: message });
    });
  }
  if (req.isAuthenticated()) {
    return res.redirect('/main');
  }
  res.render('login', { title: 'Log In', errors });
};

exports.postLogin = [
  validateLogin,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('login', { title: 'Log In' });
    }
    next();
  },
  passport.authenticate('local', {
    successRedirect: '/uploader',
    failureRedirect: '/log-in',
    failureFlash: true,
  }),
];

// Log-out Controllers
exports.getLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
