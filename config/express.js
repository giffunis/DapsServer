var express = require('express');
var glob = require('glob');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');

module.exports = function(app, config) {

  // routes
  var router = require(config.root + '/app/routers/index');
  var doctorRouter = require(config.root + '/app/routers/doctor');
  var quizRouter = require(config.root + '/app/routers/quiz');
  var patientRouter = require(config.root + '/app/routers/patient');
  var heartBeatRouter = require(config.root + '/app/routers/heartBeat');
  var activityRouter = require(config.root + '/app/routers/activity');

  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  // view engine setup
  app.set('layout', 'layout'); // defaults to 'layout'
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser('TFG-2016'));
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride('_method'));
  app.use(session());

  // Helpers dinamic
  app.use(function(req,res,next){
    if(!req.path.match(/\/login|\/logout|\/user/)){
      req.session.redir = req.path;
    }
    // para hacer visible a las listas la variable req.session
    res.locals.session = req.session;
    next();
  });

  //Asignación de las rutas
  app.use('/', router);
  app.use('/doctor/', doctorRouter);
  app.use('/quiz/', quizRouter);
  app.use('/patient/', patientRouter);
  app.use('/heartbeat/', heartBeatRouter);
  app.use('/activity/', activityRouter);

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('pages/error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('pages/error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
