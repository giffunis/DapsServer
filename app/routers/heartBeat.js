var express = require('express');
var heartBeatRouter = express.Router();
var sessionController = require('../controllers/session');
var heartBeatController = require('../controllers/heartBeat');

// Autoloads
heartBeatRouter.param('heartBeatId', heartBeatController.load);

// Rutas para obtener los datos del corazón
heartBeatRouter.get('/:heartBeatId', sessionController.loginRequired, heartBeatController.show);

module.exports = heartBeatRouter;
