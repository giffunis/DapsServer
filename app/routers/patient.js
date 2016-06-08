var express = require('express');
var patientRouter = express.Router();
var patientController = require('../controllers/patient');
var sessionController = require('../controllers/session');


//  GET '/new'
quizRouter.get('/new', sessionController.loginRequired, patientController.new);



module.exports = patientRouter;
