var mongojs = require('mongojs');
var db = mongojs(config.db, 'quizes');

db.on('error', function (err) {
    console.log('database error', err);
});

db.on('connect', function () {
    console.log('database connected');
});

exports.index = function (req, res) {
  res.render('pages/quiz/index');
};
