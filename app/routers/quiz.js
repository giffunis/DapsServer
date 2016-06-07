var express = require('express');
var quizRouter = express.Router();
var quizController = require('../controllers/quizes');
var sessionController = require('../controllers/session');

//  GET '/'
quizRouter.get('/', sessionController.loginRequired, quizController.index);

module.exports = quizRouter;
