var express = require('express');
var heartBeatRouter = express.Router();
var sessionController = require('../controllers/session');
var heartBeatController = require('../controllers/heartBeat');

// Rutas para obtener los datos del corazón
heartBeatRouter.get('/', sessionController.loginRequired, heartBeatController.show);

module.exports = heartBeatRouter;
