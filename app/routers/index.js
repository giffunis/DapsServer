var express = require('express');
var router = express.Router();
var homeController = require('../controllers/home');
var sessionController = require('../controllers/session');

//  GET '/'
// router.RequestMethod(URL,controller)
router.get('/', homeController.home);
// login GET
router.get('/login', sessionController.new);
// login POST
router.post('/login', sessionController.create);
// logout
router.get('/logout', sessionController.loginRequired, sessionController.destroy);

module.exports = router;
