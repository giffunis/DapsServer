var express = require('express');
var doctorRouter = express.Router();
var doctorController = require('../controllers/doctor');
var sessionController = require('../controllers/session');

//  GET '/new'
doctorRouter.get('/new', doctorController.new);
// POST '/new'
doctorRouter.post('/new', doctorController.create);
// POST '/'
doctorRouter.get('/', sessionController.loginRequired, doctorController.show);

module.exports = doctorRouter;
