const { Router } = require('express');

const uploaderController = require('../controllers/uploaderController');

const uploaderRouter = Router();

//Uploader Routes
uploaderRouter.get('/', uploaderController.getUploader);

module.exports = uploaderRouter;
