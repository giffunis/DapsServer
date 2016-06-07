var express = require('express');
var testRouter = express.Router();
var testController = require('../controllers/test');
var sessionController = require('../controllers/session');

//  GET '/new'
doctorRouter.get('/', sessionController.loginRequired, testController.index);

module.exports = testRouter;
