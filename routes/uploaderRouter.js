const { Router } = require('express');
const multer = require('multer');

const uploaderController = require('../controllers/uploaderController');

const uploaderRouter = Router();

// Uploader Routes
uploaderRouter.get('/', uploaderController.getUploader);
uploaderRouter.post('/', uploaderController.postUploader);

module.exports = uploaderRouter;
