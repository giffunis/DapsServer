var mongoose = require('mongoose');
var Doctor = mongoose.model('Doctor');

exports.autenticar = function (username, password, callback) {
  Doctor.findOne({ username: username}, function (error, user){
    if(error){
      console.log('if error');
      callback(new Error(error.message));
    } else {
      if (user) {
        if (user.password == password) {
          callback(null, user);
        } else {
          callback(new Error('El nombre de usuario y la contraseña no coinciden'));
        }
      } else {
        callback(new Error('El nombre de usuario no existe'));
      }
    }
  });
};

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
        for(var i in err.errors){
          console.log(err.errors[i].message);
        }
        res.render('pages/doctor/new', {doctor: doctor, errors: err.errors});
    } else {
      res.redirect('/login');
    }
  });
};

exports.show = function(req,res){
  res.render('pages/doctor/index');
};
