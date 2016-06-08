var mongoose = require('mongoose');
var Patient = mongoose.model('Patient');


exports.new = function (req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};

  // var doctor = new Doctor({
  //   username: "",
  //   password: "",
  //   name_and_surname: "",
  //   colegiado: null,
  //   especialidad: "",
  //   email: "",
  //   mobile: null
  // });

  res.render('pages/patient/new', { errors: errors});
};
//
// exports.create = function(req, res, next) {
//   console.log('función: doctor.create');
//   var doctor = new Doctor(req.body.doctor);
//
//   doctor.save(function(err){
//     if(err){
//         for(var i in err.errors){
//           console.log(err.errors[i].message);
//         }
//         res.render('pages/doctor/new', {doctor: doctor, errors: err.errors});
//     } else {
//       res.redirect('/login');
//     }
//   });
// };
