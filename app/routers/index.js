var express = require('express');
var router = express.Router();
var homeController = require('../controllers/home');

//  GET '/'
router.get('/', homeController.home);
// login GET
router.get('/login', homeController.login);

module.exports = router;
