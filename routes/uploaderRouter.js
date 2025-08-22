const { Router } = require('express');

const uploaderController = require('../controllers/uploaderController');

const uploaderRouter = Router();

// Uploader Routes
uploaderRouter.get('/', uploaderController.getUploader);
uploaderRouter.post('/', uploaderController.postUploader);

// Folder Routes
uploaderRouter.get('/*folders', uploaderController.getFolder);
uploaderRouter.post('/folder', uploaderController.postFolder);

module.exports = uploaderRouter;
