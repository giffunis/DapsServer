var crypto = require('crypto');
var mongojs = require('mongojs');
var activityDB = mongojs('mongodb://localhost/dapsserver-development', ['activity']);
var db = mongojs('mongodb://localhost/dapsserver-development', ['patients']);


compruebaSignature = function(mensajefirmado, respuesta) {
  var clavePublicaMovil = '-----BEGIN PUBLIC KEY-----\n' +
  'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEbANPZ/m6DDJKt3QFYMIzHOeGzoJ0\n' +
  'avpVCdDv2JY3VOMoavbqxVk0aS/jOI5lUmt5k9sasYtFgQ9bqHYVTilmRQ==\n' +
  '-----END PUBLIC KEY-----';

  // Choose algorithm to the hash function
  var algorithm = 'sha1';

  var message = JSON.stringify(respuesta);

  // console.log(message);

  // Comprobar la firma y el mensaje
  var verifier = crypto.createVerify(algorithm);
  verifier.update(message);
  var ver = verifier.verify(clavePublicaMovil, mensajefirmado,'base64');
  return ver;
};

exports.show = function(req,res){
  var id = req.query.patientId;
  var desde = new Date(req.query.desde);
  var hasta = new Date(req.query.hasta);
  console.log(id);
  activityDB.activity.find({ patientId: mongojs.ObjectId(id), created_at: { '$gte': desde, '$lte': hasta}}).sort({created_at: 1}, function (err, docs) {
    if(err){
      console.log("Error en la consulta");
      res.send(err);
    }else if (docs.length !== 0) {
      var data = [];
      var punto;
      for (var i = 0; i < docs.length; i++) {
        console.log(docs[i]);
        var day = docs[i].created_at.getDate();
        var month = docs[i].created_at.getMonth() + 1;
        punto = [day + "/" + month, docs[i].steps];
        data.push(punto);
      }
      var salida = {"label": "Actividad semanal", "data": data};
      res.send(salida);
    } else {
      res.send("No existen datos");
    }
  });
};

exports.new = function(req,res){
  console.log("req.body.signature: " + req.body.signature);
  console.log("req.body.mensaje: ");
  console.log(req.body.mensaje);
  var firma = compruebaSignature(req.body.signature,req.body.mensaje);
  console.log("La firma es: " + firma);

  if (firma !== true) {
    res.status(200).json({'respuesta':'La firma es falsa'});
  }

  var pasos = req.body.mensaje.steps;
  var idUser = req.body.mensaje.id;
  var fecha = new Date();

  var newObj;
  var paciente;

  var almacenarPasos_P = new Promise(function(resolve,reject){
    activityDB.activity.insert({"steps": pasos, "patientId": mongojs.ObjectId(idUser), "created_at": fecha}, function(err, obj){
      if(err){
        reject(err);
      } else {
        resolve(obj);
      }
    });
  });

  almacenarPasos_P.then(function(obj){
    console.log("Pasos almacenados");
    newObj = obj;
  },function(err){
    console.log(err);
    res.status(200).json({'respuesta':'Error en el servidor'});
  });

  var buscarPaciente_P = new Promise(function(resolve,reject){
    db.patients.findOne({ _id: mongojs.ObjectId(idUser)}, function (err, obj){
      if(err){
        reject(err);
      }else {
        resolve(obj);
      }
    });
  });

  buscarPaciente_P.then(function(obj){
    console.log("Paciente encontrado");
    paciente = obj;
  },function(err){
    console.log(err);
    res.status(200).json({'respuesta':'Error en el servidor'});
  });

  Promise.all([almacenarPasos_P, buscarPaciente_P]).then(function(){

    var newactivityDataQueue = [];

    for(var i = 0; i < paciente.activityDataQueue.length; i++){
        newactivityDataQueue.push(paciente.activityDataQueue[i]);
    }

    newactivityDataQueue.push(newObj._id);

    db.patients.update({ '_id': paciente._id}, {'$set': {'activityDataQueue': newactivityDataQueue}}, function(err){
      if(err){
        console.log(err);
        res.status(200).json({'respuesta':'Error en el servidor'});
      } else {
        console.log("BBDD actualizada correctamente");
        res.status(200).json({'respuesta':'OK'});
      }
    });

  },function(){
    console.log("No se han cumplido las promesas");
    res.status(200).json({'respuesta':'Error en el servidor'});
  });

};
