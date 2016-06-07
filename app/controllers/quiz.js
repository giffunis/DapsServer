var config = require('../../config/config');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost/dapsserver-development', ['quizes']);

db.on('error', function (err) {
    console.log('database error', err);
});

db.on('connect', function () {
    console.log('database connected');
});

exports.load = function (req, res, next, quizId) {
  db.quizes.find({ _id: mongojs.ObjectId(quizId)}, function (err, quiz){
    if (err) {
      next (new Error (err));
    } else if (quiz){
      req.quiz = quiz;
      next();
    } else {
      next (new Error ('El test no se encuentra disponible en este momento'));
    }
  });
};

exports.index = function (req, res, next) {

  db.quizes.find(function (err, docs) {
    if(err){
      next(new Error(err));
    } else {
      res.render('pages/quiz/index', {title: 'Quizes en la base de datos', quizes: docs});
    }
  });
};
