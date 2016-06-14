var express = require('express');
var patientRouter = express.Router();
var patientController = require('../controllers/patient');
var sessionController = require('../controllers/session');
var quizController = require('../controllers/quiz');

// Autoloads
patientRouter.param('patientId', patientController.load);
patientRouter.param('quizId', quizController.load);
patientRouter.param('solvedId', patientController.solvedQuizLoad);

//  GET '/new'
patientRouter.get('/new', sessionController.loginRequired, patientController.new);
patientRouter.post('/new', sessionController.loginRequired, patientController.create);
patientRouter.get('/', sessionController.loginRequired, patientController.index);
patientRouter.get('/:patientId([a-z0-9]{24})', sessionController.loginRequired, patientController.show);
patientRouter.put('/:patientId([a-z0-9]{24})/quiz/add', sessionController.loginRequired, patientController.addUnsolvedQuiz);
patientRouter.get('/:patientId([a-z0-9]{24})/quiz/solvedQuizes/:solvedId([a-z0-9]{24})', sessionController.loginRequired, patientController.showSolvedQuiz);


// Rutas para el dispositivo móvil
patientRouter.get('/:patientId([a-z0-9]{24})/quiz/unsolvedQuizes', patientController.IndexUnsolvedQuizes);
patientRouter.get('/:patientId([a-z0-9]{24})/quiz/unsolvedQuizes/:quizId([a-z0-9]{24})', patientController.showUnsolvedQuiz);
patientRouter.put('/:patientId([a-z0-9]{24})/quiz/solvedQuizes/add', patientController.uploadSolvedQuiz);

module.exports = patientRouter;
