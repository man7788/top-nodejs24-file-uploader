const { Router } = require('express');

const indexController = require('../controllers/indexController');

const indexRouter = Router();

// Index Routes
indexRouter.get('/', indexController.getIndex);

// Sign-up Routes
indexRouter.get('/sign-up', indexController.getSignup);

// Log-in Routes
indexRouter.get('/log-in', indexController.getLogin);

// Main Routes
indexRouter.get('/main', indexController.getMain);

module.exports = indexRouter;
