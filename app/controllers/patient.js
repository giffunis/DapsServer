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
    birthDate: null,
    mobileNumber: null,
    contactPerson: null,
    personTlf: null,
    smoker: false,
    memoryProblems: false,
    heartCondition: false,
    doctor: null,
  });

  res.render('pages/patient/new', { patient: patient, errors: errors});
};


exports.create = function(req, res, next) {
  console.log('función: patient.create');
  var patient = new Patient(req.body.patient);
  console.log(req.body.patient.birthDate);

  patient.save(function(err){
    if(err){
        for(var i in err.errors){
          console.log(err.errors[i].message);
        }
        res.render('pages/patient/new', {patient: patient, errors: err.errors});
    } else {
      res.send('Usuario creado correctamente');
    }
  });
};

exports.index = function(req, res, next) {
  Patient.find({}, function(err, patients){
    if (err) {
      next(new Error(err));
    } else {
      res.status(200).send(patients);
    }
  });
};
