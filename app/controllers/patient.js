var crypto = require('crypto');
var mongoose = require('mongoose');
var Patient = mongoose.model('Patient');
var Doctor = mongoose.model('Doctor');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost/dapsserver-development', ['patients']);
var db2 = mongojs('mongodb://localhost/dapsserver-development', ['quizes']);
var dbSolvedQuises = mongojs('mongodb://localhost/dapsserver-development', ['solvedquizes']);

// Choose algorithm to the hash function
var algorithm = 'sha1';

var publicKey = '-----BEGIN PUBLIC KEY-----\n' +
'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEBH8Z/WHOHm/ZbDDoFJGy2xobkc5v\n' +
'qssP/iIngDj2gcC751zvKkffEVCMCVvyNzcwfeQOOblwQrKTI5eM3ucuuQ==\n' +
'-----END PUBLIC KEY-----';

var privateKey = '-----BEGIN PRIVATE KEY-----\n' +
'MEACAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJjAkAgEBBB/0C/yG6Ro0WxfjyBKI\n' +
'MAT9WnyDRnB3gvKD5AR3En9P\n' +
'-----END PRIVATE KEY-----';

var clavePublicaMovil = '-----BEGIN PUBLIC KEY-----\n' +
'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEbANPZ/m6DDJKt3QFYMIzHOeGzoJ0\n' +
'avpVCdDv2JY3VOMoavbqxVk0aS/jOI5lUmt5k9sasYtFgQ9bqHYVTilmRQ==\n' +
'-----END PUBLIC KEY-----';

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

firmar = function(array){
  var prueba = {"respuesta":array};
  var message = JSON.stringify(prueba.respuesta);
  console.log("message:\n" + message);
  // Ejemplo de firma
  var signer = crypto.createSign(algorithm);
  signer.update(message);
  var sign = signer.sign(privateKey,'base64');
  console.log("sign:\n" + sign);

  var salida = [{"signature": sign, "respuesta": array}];
  console.log(JSON.stringify(salida));
  return salida;
};

exports.solvedQuizLoad = function (req, res, next, solvedId) {
  console.log("solvedQuizLoad " + solvedId);
  dbSolvedQuises.solvedquizes.findOne({ _id: mongojs.ObjectId(solvedId)}, function(err, doc) {
    if(err){
      next (new Error (err));
    } else if(doc !== null) {
      req.solvedQuiz = doc;
      next();
    } else {
      next (new Error ('El solvedQuiz no existe'));
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
  var quizes;
  var usqCont = 0;
  var sqCont = 0;
  var unSolvedQuizes = [];
  var solvedQuizes = [];

  getOneUnSolvedQuiz = function(callback,callback2){
    get = new Promise (function(resolve, reject){
      db2.quizes.findOne({ _id: mongojs.ObjectId(req.patient.unSolvedQuizes[usqCont])}, function(err, doc) {
        if(err){
          reject(err);
        } else if(doc !== null){
          unSolvedQuizes.push(doc);
          resolve();
        }else {
          resolve();
        }
      });
    }).then(function(doc){
      usqCont++;
      console.log("Se ha cumplido la promesa, getOneUnsolvedQuizP; El contador = " + usqCont);
      if(usqCont < req.patient.unSolvedQuizes.length){
        getOneUnSolvedQuiz(callback,callback2);
      }else {
        callback();
      }
    },function(err){console.log('Se ha producido un error en la promesa getOneUnsolvedQuizP:' + err); callback2();});
  };

  var getAllUnSolvedQuizesP = new Promise(function(resolve,reject){
    getOneUnSolvedQuiz(resolve,reject);
  });

  getAllUnSolvedQuizesP.then(function (){
    console.log('getAllUnsolvedQuizesP se ha cumplido. Armacenando los docs en quizes');
  }, function (err) {
    console.log('getAllUnsolvedQuizesP no se ha cumplido');
  });

  getOneSolvedQuiz = function(callback,callback2){
    get = new Promise (function(resolve, reject){
      dbSolvedQuises.solvedquizes.findOne({ _id: mongojs.ObjectId(req.patient.solvedQuizes[sqCont])}, function(err, doc) {
        if(err){
          reject(err);
        } else if(doc !== null) {
          solvedQuizes.push(doc);
          resolve();
        } else {
          resolve();
        }
      });
    }).then(function(doc){
      sqCont++;
      console.log("Se ha cumplido la promesa, getOneSolvedQuizP; El contador = " + sqCont);
      if(sqCont < req.patient.solvedQuizes.length){
        getOneSolvedQuiz(callback,callback2);
      }else {
        callback();
      }
    },function(err){console.log('Se ha producido un error en la promesa getOneSolvedQuizP:' + err); callback2();});
  };

  var getAllSolvedQuizesP = new Promise(function(resolve,reject){
    getOneSolvedQuiz(resolve,reject);
  });

  getAllSolvedQuizesP.then(function (){
    console.log('getAllSolvedQuizesP se ha cumplido');
  }, function (err) {
    console.log('getAllSolvedQuizesP no se ha cumplido');
  });

  var getAllQuizesP = new Promise(function(resolve,reject){
    db2.quizes.find(function (err, docs) {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });

  getAllQuizesP.then(function (docs){
    console.log('allQuizesP se ha cumplido. Armacenando los docs en quizes');
    quizes = docs;
  }, function (err) {
    console.log('allQuizesP no se ha cumplido. Error: ' + err);
  });

  Promise.all([getAllQuizesP, getAllUnSolvedQuizesP, getAllSolvedQuizesP]).then(function(){
    res.render('pages/patient/show', { title: 'Datos del paciente', patient: req.patient, solvedQuizes: solvedQuizes, unSolvedQuizes: unSolvedQuizes, quizes: quizes});
  }, function(){res.send('Se ha producido un error');});

};

exports.addUnsolvedQuiz = function(req, res, next){
  var unSolvedQuizes = req.patient.unSolvedQuizes;
  unSolvedQuizes.push(req.body.addQuiz);
  Patient.update({ '_id': req.patient._id}, {'$set': {'unSolvedQuizes': unSolvedQuizes}}, function(err){
    if(err){
      next(new Error(err));
    } else {
      res.send("ok, el test ha sido asignado");
    }
  });
};

exports.IndexUnsolvedQuizes = function (req, res){
  var usqCont = 0;
  var unSolvedQuizes = [];

  getOneUnSolvedQuiz = function(callback,callback2){
    get = new Promise (function(resolve, reject){
      db2.quizes.findOne({ _id: mongojs.ObjectId(req.patient.unSolvedQuizes[usqCont])}, {quizName: 1}, function(err, doc) {
        if(err){
          reject(err);
        } else if(doc !== null){
          unSolvedQuizes.push(doc);
          resolve();
        }else {
          resolve();
        }
      });
    }).then(function(doc){
      usqCont++;
      console.log("Se ha cumplido la promesa, getOneUnsolvedQuizP; El contador = " + usqCont);
      if(usqCont < req.patient.unSolvedQuizes.length){
        getOneUnSolvedQuiz(callback,callback2);
      }else {
        callback();
      }
    },function(err){console.log('Se ha producido un error en la promesa getOneUnsolvedQuizP:' + err); callback2();});
  };

  var getAllUnSolvedQuizesP = new Promise(function(resolve,reject){
    getOneUnSolvedQuiz(resolve,reject);
  });

  getAllUnSolvedQuizesP.then(function (){
    console.log('getAllUnsolvedQuizesP se ha cumplido. Armacenando los docs en quizes');
    res.json(firmar(unSolvedQuizes));
    // res.json(unSolvedQuizes);
  }, function (err) {
    console.log('getAllUnsolvedQuizesP no se ha cumplido');
  });
};

exports.showUnsolvedQuiz = function (req, res) {
  res.json(req.quiz);
};

exports.uploadSolvedQuiz = function (req, res) {
  var result;
  console.log(req.body);

  var saveInDBP = new Promise(function(resolve,reject){
    dbSolvedQuises.solvedquizes.insert(req.body, function (err, quiz) {
      if(err){
        reject(err);
      } else {
        result = quiz;
        resolve();
      }
    });
  });

  saveInDBP.then(function (){
    console.log('saveInDBP se ha cumplido. Armacenando el quiz resuelto en la BBDD');

    var deleteUnSolvedQuizP = new Promise(function(resolve, reject){
      var unSolvedQuizes = [];
      for(var i = 0; i < req.patient.unSolvedQuizes.length; i++){
        if(req.patient.unSolvedQuizes[i] != req.body.quizId){
          unSolvedQuizes.push(req.patient.unSolvedQuizes[i]);
        }
      }
      Patient.update({ '_id': req.patient._id}, {'$set': {'unSolvedQuizes': unSolvedQuizes}}, function(err){
        if(err){
          reject(err);
        } else {
          resolve();
        }
      });
    }).then(function (){
      console.log("deleteUnSolvedQuizP: Se ha eliminado el test de unSolvedQuizes");
    }, function(err){
      console.log("deleteUnSolvedQuizP: Se ha producido un error, " + err);
    });

  }, function (err) {
    console.log('Error en saveInDBP' + err);
  });

  Promise.all([saveInDBP]).then(function(){
    var solvedQuizes = [];
    solvedQuizes = req.patient.solvedQuizes;
    solvedQuizes.push(result._id);
    Patient.update({ '_id': req.patient._id}, {'$set': {'solvedQuizes': solvedQuizes}}, function(err){
      if(err){
        res.status(200).json({'respuesta':'Se han cumplido las promesas pero no se ha podido actualizar el solvedquizes del paciente'});
      } else {
        res.status(200).json({'respuesta':'ok'});
      }
    });
  }, function(){res.status(200).json({'respuesta':'No se ha podido guardar el quiz resuelto en la BBDD'});});

  // dbSolvedQuises.solvedquizes.insert(req.body, function (err) {
  //   if(err){
  //     console.log('Error: No se ha podido guardar el documento en la bd');
  //     res.status(200).json({'respuesta':'No se ha podido guardar el quiz resuelto en la BBDD'});
  //   } else {
  //     console.log('Se ha guardado el test en la BBDD');
  //     res.status(200).json({'respuesta':'Se ha guardado el test en la BBDD'});
  //   }
  // });
};

exports.showSolvedQuiz = function(req,res){
  res.render('pages/patient/quizShow', {title: "Test realizado por el paciente", quiz: req.solvedQuiz});
};
