var express = require('express');
var doctorRouter = express.Router();
var doctorController = require('../controllers/doctor');

//  GET '/new'
doctorRouter.get('/new', doctorController.new);
// POST '/new'
doctorRouter.post('/new', doctorController.create);
// POST '/'
doctorRouter.get('/', doctorController.show);

module.exports = doctorRouter;
