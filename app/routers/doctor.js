var express = require('express');
var doctorRouter = express.Router();
var doctorController = require('../controllers/doctor');

//  GET '/'
router.get('/new', doctorController.new);

module.exports = doctorRouter;
