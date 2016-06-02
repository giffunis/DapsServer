var mongoose = require('mongoose');
var Doctor = mongoose.model('Doctor');

exports.new = function (req, res){
  var errors = req.session.errors || {};
  req.session.errors = {};

  var doctor = new Doctor({
    username: "",
    password: "",
    name_and_surname: "",
    colegiado: 0,
    especialidad: "",
    email: "",
    mobile: 0
  });

  res.render('pages/doctor/new', {doctor: doctor, errors: errors});
};
