var express = require('express');
var quizRouter = express.Router();
var quizController = require('../controllers/quiz');
var sessionController = require('../controllers/session');

//  GET '/'
// quizRouter.get('/', sessionController.loginRequired, quizController.index);
quizRouter.get('/', quizController.index);
module.exports = quizRouter;
