const { Router } = require('express');

const indexController = require('../controllers/indexController');

const indexRouter = Router();

// Index Routes
indexRouter.get('/', indexController.getIndex);

// Sign-up Routes
indexRouter.get('/sign-up', indexController.getSignup);
indexRouter.post('/sign-up', indexController.postSignup);

// Log-in Routes
indexRouter.get('/log-in', indexController.getLogin);
indexRouter.post('/log-in', indexController.postLogin);

// Log-out Routes
indexRouter.get('/log-out', indexController.getLogout);

// Main Routes
indexRouter.get('/main', indexController.getMain);

module.exports = indexRouter;
