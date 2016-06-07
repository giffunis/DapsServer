var config = require('../../config/config');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost/dapsserver-development', ['quizes']);

db.on('error', function (err) {
    console.log('database error', err);
});

db.on('connect', function () {
    console.log('database connected');
});

exports.index = function (req, res, next) {

  db.quizes.find(function (err, docs) {
    if(err){
      next(new Error(err));
    } else {
      res.render('pages/quiz/index', {quizes: docs});
    }
  });
};
