const { Router } = require('express');

const uploaderController = require('../controllers/uploaderController');

const uploaderRouter = Router({ mergeParams: true });

// Uploader Routes
uploaderRouter.get('/', uploaderController.getUploader);
uploaderRouter.post('/', uploaderController.postUploader);

// Folder Routes
uploaderRouter.get('/*folders', uploaderController.getFolder);

module.exports = uploaderRouter;
