var express = require('express');
var patientRouter = express.Router();
var patientController = require('../controllers/patient');
var sessionController = require('../controllers/session');

// Autoloads
patientRouter.param('patientId', patientController.load);

//  GET '/new'
patientRouter.get('/new', sessionController.loginRequired, patientController.new);
patientRouter.post('/new', sessionController.loginRequired, patientController.create);
patientRouter.get('/', sessionController.loginRequired, patientController.index);
patientRouter.get('/:patientId([a-z0-9]{24})', sessionController.loginRequired, patientController.show);

patientRouter.get('/:patientId([a-z0-9]{24})/quiz/add/:quizId([a-z0-9]{24})', sessionController.loginRequired, patientController.addQuiz);



module.exports = patientRouter;
