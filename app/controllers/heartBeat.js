var crypto = require('crypto');
var mongojs = require('mongojs');
var heartbeatsDB = mongojs('mongodb://localhost/dapsserver-development', ['heartbeats']);
var db = mongojs('mongodb://localhost/dapsserver-development', ['patients']);


exports.show = function(req,res){
  var id = req.query.patientId;
  var desde = new Date(req.query.desde);
  var hasta = new Date(req.query.desde);
  hasta.setHours(hasta.getHours() + 24);
  console.log(id);
  heartbeatsDB.heartbeats.find({ patientId: mongojs.ObjectId(id), created_at: { '$gte': desde, '$lte': hasta}}, function (err, docs) {
    if(err){
      console.log("Error en la consulta");
      res.send(err);
    }else if (docs.length !== 0) {
      var data = [];
      var punto;
      for (var i = 0; i < docs.length; i++) {
        punto = [docs[i].created_at.getHours() + ":" + docs[i].created_at.getMinutes(), docs[i].pulso];
        data.push(punto);
      }
      var salida = {"label": "Frecuencia Cardiaca", "data": data};
      res.send(salida);
    } else {
      res.send("No existen datos");
    }
  });
};

comprobarSignature = function(mensajefirmado, respuesta) {
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

exports.new = function(req,res){
  console.log("req.body.signature: " + req.body.signature);
  console.log("req.body.mensaje: ");
  console.log(req.body.mensaje);
  var firma = comprobarSignaturea(req.body.signature,req.body.mensaje);
  console.log("La firma es: " + firma);

  if (firma !== true) {
    res.status(200).json({'respuesta':'La firma es falsa'});
  }

  var latido = req.body.mensaje.pulso;
  var idUser = req.body.mensaje.id;
  var fecha = new Date();

  var newObj;
  var paciente;

  var almacenarLatido_P = new Promise(function(resolve,reject){
    heartbeatsDB.heartbeats.insert({"pulso": latido, "patientId": mongojs.ObjectId(idUser), "created_at": fecha}, function(err, obj){
      if(err){
        reject(err);
      } else {
        resolve(obj);
      }
    });
  });

  almacenarLatido_P.then(function(obj){
    console.log("Latido almacenado");
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

  Promise.all([almacenarLatido_P, buscarPaciente_P]).then(function(){

    var newHeartBeatDataQueue = [];

    for(var i = 0; i < paciente.heartBeatDataQueue.length; i++){
        newHeartBeatDataQueue.push(paciente.heartBeatDataQueue[i]);
    }

    newHeartBeatDataQueue.push(newObj._id);

    db.patients.update({ '_id': paciente._id}, {'$set': {'heartBeatDataQueue': newHeartBeatDataQueue}}, function(err){
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
