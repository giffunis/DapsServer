var express = require('express');
var patientRouter = express.Router();
var patientController = require('../controllers/patient');
var sessionController = require('../controllers/session');
var quizController = require('../controllers/quiz');

// Autoloads
patientRouter.param('patientId', patientController.load);
patientRouter.param('quizId', quizController.load);

//  GET '/new'
patientRouter.get('/new', sessionController.loginRequired, patientController.new);
patientRouter.post('/new', sessionController.loginRequired, patientController.create);
patientRouter.get('/', sessionController.loginRequired, patientController.index);
patientRouter.get('/:patientId([a-z0-9]{24})', sessionController.loginRequired, patientController.show);

patientRouter.get('/:patientId([a-z0-9]{24})/quiz/add/:quizId([a-z0-9]{24})', sessionController.loginRequired, patientController.addUnsolvedQuiz);


// Rutas para el dispositivo móvil
patientRouter.get('/:patientId([a-z0-9]{24})/quiz/unsolvedQuizes', patientController.IndexUnsolvedQuizes);

module.exports = patientRouter;
