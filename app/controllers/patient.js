var mongoose = require('mongoose');
var Patient = mongoose.model('Patient');


exports.new = function (req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};

  var patient = new Patient({
    name: "",
    lastName: "",
    dni: "",
    password: "",
    sex: "",
    birthDate: "",
    mobileNumber: null,
    contactPerson: null,
    personTlf: null,
    smoker: false,
    memoryProblems: false,
    heartCondition: false,
    quizToDo: [],
    finishedQuiz: [],
    heartBeatDataQueue: [],
    activityDataQueue: []
  });

  res.render('pages/patient/new', { patient: patient, errors: errors});
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
