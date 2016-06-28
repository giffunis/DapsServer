var express = require('express');
var activityRouter = express.Router();
var sessionController = require('../controllers/session');
var activityController = require('../controllers/activity');

// Rutas para obtener los datos del corazón
activityRouter.get('/', sessionController.loginRequired, activityController.show);

module.exports = activityRouter;
