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
