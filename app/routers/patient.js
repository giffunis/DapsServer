var express = require('express');
var patientRouter = express.Router();
var patientController = require('../controllers/patient');
var sessionController = require('../controllers/session');


//  GET '/new'
patientRouter.get('/new', sessionController.loginRequired, patientController.new);
patientRouter.post('/new', sessionController.loginRequired, patientController.create);


module.exports = patientRouter;
