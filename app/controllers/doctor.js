var mongoose = require('mongoose');
var Doctor = mongoose.model('Doctor');

exports.new = function (req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};

  var doctor = new Doctor({
    username: "",
    password: "",
    name_and_surname: "",
    colegiado: null,
    especialidad: "",
    email: "",
    mobile: null
  });

  res.render('pages/doctor/new', {doctor: doctor, errors: errors});
};

exports.create = function(req, res, next) {
  console.log('función: doctor.create');
  var doctor = new Doctor(req.body.doctor);

  doctor.save(function(err){
    if(err){
        res.render('pages/doctor/new', {doctor: doctor, errors: err.errors});
    } else {
      res.redirect('/login');
    }
  });
};
