var mongoose = require('mongoose');
var Doctor = mongoose.model('Doctor');

exports.new = function (req, res){
  var errors = req.session.errors || {};
  req.session.errors = {};


  res.render('pages/doctor/new', {errors: errors});
};
