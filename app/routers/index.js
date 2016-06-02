var express = require('express');
var router = express.Router();
var homeController = require('../controllers/home');
var sessionController = require('../controllers/session');

//  GET '/'
router.get('/', homeController.home);
// login GET
router.get('/login', sessionController.login);

module.exports = router;
