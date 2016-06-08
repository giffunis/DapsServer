var express = require('express');
var quizRouter = express.Router();
var quizController = require('../controllers/quiz');
var sessionController = require('../controllers/session');

// Autoloads
quizRouter.param('quizId', quizController.load);

//  GET '/'
quizRouter.get('/', sessionController.loginRequired, quizController.index);
// GET '/:quizId'
quizRouter.get('/:quizId([a-z0-9]{24})', sessionController.loginRequired, quizController.show);
// Get '/upload'
quizRouter.get('/upload', sessionController.loginRequired, quizController.newUpload);
module.exports = quizRouter;
