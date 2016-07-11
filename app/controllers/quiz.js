var config = require('../../config/config');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost/dapsserver-development', ['quizes']);
var multer = require('multer');
var upload = multer({ dest: 'public/uploads'}).single('quizJsonFile');
var jsonfile = require('jsonfile');

db.on('error', function (err) {
    console.log('database error', err);
});

db.on('connect', function () {
    console.log('database connected');
});

exports.load = function (req, res, next, quizId) {
  db.quizes.findOne({ _id: mongojs.ObjectId(quizId)}, function (err, quiz){
    if (err) {
      next (new Error (err));
    } else if (quiz !== null){
      req.quiz = quiz;
      next();
    } else {
      next (new Error ('El test no existe'));
    }
  });
};

exports.index = function (req, res, next) {

  db.quizes.find(function (err, docs) {
    if(err){
      next(new Error(err));
    } else {
      res.render('pages/quiz/index', {title: 'Quizes en la base de datos', partial: '../../partials/quiz/quizList', quizes: docs});
    }
  });
};

exports.show = function (req, res){
  res.render('pages/quiz/index', {title: 'Detalles del Quiz', partial: '../../partials/quiz/quizShow', quiz: req.quiz});
};

exports.getUpload = function (req, res) {
  res.render('pages/quiz/upload', {title: 'Subir un nuevo test', message: null, errors: []});
};

exports.postUpload = function (req, res, next){
  upload(req, res, function(err){
    if (err) {
      next(new Error(err));
    } else {
      if(req.file){
        console.log('Multen: Archivo subido sin errors');
        console.log('Ruta completa al archivo: ' + req.file.path);
        jsonfile.readFile(req.file.path, function(err, obj) {
          db.quizes.insert(obj, function (err) {
            if(err){
              console.log('Error: No se ha podido guardar el documento en la bd');
              res.json({respuesta: "No se ha podido guardar el documento en la bd"});
              // res.render('pages/quiz/upload', {title: 'Subir un nuevo test', message: null, errors: err.errors});
            } else {
              console.log('Correct: El documento se ha almacenado correctamente en la bd');
              // res.render('pages/quiz/upload', {title: 'Subir un nuevo test', message: 'Documento almacenado y volcado en la BBDD',errors: []});
              res.json({respuesta: "Correcto: El documento se ha almacenado correctamente en la bd"});

            }
          });
        });
      } else {
        // res.render('pages/quiz/upload', {title: 'Subir un nuevo test', message: 'Debes elegir un archivo.json',errors: []});
        res.json({respuesta: "Error: Debes elegir un archivo.json"});

      }
    }
  });
};
