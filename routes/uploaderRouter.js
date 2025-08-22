const { Router } = require('express');

const uploaderController = require('../controllers/uploaderController');

const uploaderRouter = Router();

// Uploader Routes
uploaderRouter.get('/', uploaderController.getUploader);
uploaderRouter.post('/', uploaderController.postUploader);

// Folder Routes
uploaderRouter.post('/folder', uploaderController.postFolder);
uploaderRouter.get('/*folders', uploaderController.getFolder);
uploaderRouter.delete('/*folders', uploaderController.deleteFolder);

module.exports = uploaderRouter;
