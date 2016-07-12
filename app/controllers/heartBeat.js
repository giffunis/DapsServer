var crypto = require('crypto');
var mongojs = require('mongojs');
var heartbeatsDB = mongojs('mongodb://localhost/dapsserver-development', ['heartbeats']);

exports.show = function(req,res){
  var id = req.query.patientId;
  var desde = new Date(req.query.desde);
  var hasta = new Date(req.query.hasta);
  console.log(id);
  heartbeatsDB.heartbeats.find({ patientId: mongojs.ObjectId(id), created_at: { '$gte': desde, '$lte': hasta}}, function (err, docs) {
    if(err){
      console.log("Error en la consulta");
      res.send(err);
    }else if (docs.length !== 0) {
      var data = [];
      var punto;
      for (var i = 0; i < docs.length; i++) {
        punto = [docs[i].created_at.getMonth() + "/" + docs[i].created_at.getDay(), docs[i].beats];
        data.push(punto);
      }
      var salida = {"label": "Frecuencia Cardiaca", "data": data};
      res.send(salida);
    } else {
      res.send("No existen datos");
    }
  });
};

comprobarFirma = function(mensajefirmado, respuesta) {
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
  var firma = comprobarFirma(req.body.signature,req.body.mensaje);
  console.log("La firma es: " + firma);

  res.status(200).json({'respuesta':'OK'});

};
