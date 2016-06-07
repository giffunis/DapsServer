var config = require('../../config/config');
var mongojs = require('mongojs');
var db = mongojs(config.db);
var quizesCollection = db.collection('quizes');

db.on('error', function (err) {
    console.log('database error', err);
});

db.on('connect', function () {
    console.log('database connected');
});

exports.index = function (req, res, next) {
  var quizes;
  db.quizesCollection.find(function (err, docs) {
    if(err){
      next(new Error(err));
    } else {
      quizes = docs;
    }
  });
  res.render('pages/quiz/index', {quizes: quizes});
};
