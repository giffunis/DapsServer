var mongoose = require('mongoose');
var Patient = mongoose.model('Patient');
var Doctor = mongoose.model('Doctor');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost/dapsserver-development', ['patients']);
var db2 = mongojs('mongodb://localhost/dapsserver-development', ['quizes']);

exports.load = function (req, res, next, patientId) {
  db.patients.findOne({ _id: mongojs.ObjectId(patientId)}, function (err, patient){
    if (err) {
      next (new Error (err));
    } else if (patient !== null){
      Doctor.populate(patient, {path: 'doctor'},function(err, patient){
        req.patient = patient;
        next();
      });
    } else {
      next (new Error ('El paciente no existe'));
    }
  });
};

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

  res.render('pages/patient/new', { title: 'Crear un paciente', patient: patient, errors: errors});
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
        res.render('pages/patient/new', { title: 'Crear un paciente', patient: patient, errors: err.errors});
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
      Doctor.populate(patients, {path: 'doctor'},function(err, patients){
            res.render('pages/patient/index', { title: 'Pacientes', patients: patients});
        });
    }
  });
};

exports.show = function (req, res){
  var quizes, unSolvedQuizes;

  var allQuizesP = new Promise(function(resolve,reject){
    db2.quizes.find(function (err, docs) {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });

  allQuizesP.then(function (docs){
    console.log('allQuizesP se ha cumplido. Armacenando los docs en quizes');
    quizes = docs;
  }, function (err) {
    console.log('allQuizesP no se ha cumplido. Error: ' + err);
  });

  var unSolvedQuizesP = new Promise(function(resolve,reject){
    // { field: { $in: [<value1>, <value2>, ... <valueN> ] } }
    var query = " _id: { $in: [";
    for (var i = 0; i < req.patient.unSolvedQuizes.length; i++) {
      query = query + "ObjectId('" + req.patient.unSolvedQuizes[i] + "')";
      if(i != req.patient.unSolvedQuizes.length - 1){
        query = query + ",";
      }
    }
    query = query + "]}";
    console.log(query);

    db2.quizes.find({query},function (err, docs) {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });

    resolve();
  });

  unSolvedQuizesP.then(function (docs){
    console.log('unSolvedQuizesP se ha cumplido. Armacenando los docs en unSolvedQuizes');
    unSolvedQuizes = docs;
  }, function (err) {
    console.log('allQuizesP no se ha cumplido. Error: ' + err);
  });

  Promise.all([allQuizesP,unSolvedQuizesP]).then(function(){
    res.render('pages/patient/show', { title: 'Datos del paciente', patient: req.patient, solvedQuizes: null, unSolvedQuizes: unSolvedQuizes, quizes: quizes});
  }, function(){res.send('Se ha producido un error');});

};

exports.addQuiz = function(req, res, next){
  var unSolvedQuizes = req.patient.unSolvedQuizes;
  unSolvedQuizes.push(req.quiz._id);
  Patient.update({ '_id': req.patient._id}, {'$set': {'unSolvedQuizes': unSolvedQuizes}}, function(err){
    if(err){
      next(new Error(err));
    } else {
      res.send("ok, el test ha sido asignado");
    }
  });

};
