var mongojs = require('mongojs');
var mongoose = require('mongoose');
var activityDB = mongojs('mongodb://localhost/dapsserver-development', ['activity']);

exports.show = function(req,res){
  var id = req.query.search;
  // console.log(new mongoose.Types.ObjectId(id).getTimestamp().getMilliseconds());
  var desde = new Date(req.query.desde);
  var hasta = new Date(req.query.hasta);
  console.log("Desde: " + desde);
  console.log("Hasta: " + hasta);

  // activityDB.activity.find({ created_at: { '$gte': desde, '$lte': hasta}}, function (err, doc) {
  activityDB.activity.find({ $gt: desde}, function(err, doc) {
    if(err){
      console.log("Error en la consulta");
      res.send(err);
    }else if (doc.length !== 0) {
      console.log("Se ha encontrado el siguiente doc:\n" + doc.length);

      var data = [];
      var puntoL = ["lunes", 2400];
      var puntoM = ["martes", 3400];
      var puntoX = ["miercoles", 4500];
      var puntoJ = ["juevs", 1400];
      var puntoV = ["viernes", 2700];

      data.push(puntoL);
      data.push(puntoM);
      data.push(puntoX);
      data.push(puntoJ);
      data.push(puntoV);

      var salida = {"label": "Actividad semanal", "data": data, datos: doc};

      res.send(salida);
    } else {
      res.send("No existen datos");
    }
  });


  // activityDB.activity.findOne({ _id: mongojs.ObjectId(id)}, function(err, doc) {
  //   if(err){
  //     console.log("No se ha encontrado el documento");
  //     res.send("Datos no encontrados");
  //   }else {
  //     console.log("Se ha encontrado el siguiente doc:\n" + doc);
  //
  //     var data = [];
  //     var puntoL = ["lunes", 2400];
  //     var puntoM = ["martes", 3400];
  //     var puntoX = ["miercoles", 4500];
  //     var puntoJ = ["juevs", 1400];
  //     var puntoV = ["viernes", 2700];
  //
  //
  //     data.push(puntoL);
  //     data.push(puntoM);
  //     data.push(puntoX);
  //     data.push(puntoJ);
  //     data.push(puntoV);
  //
  //     var salida = {"label": "Actividad semanal", "data": data};
  //
  //     res.send(salida);
  //   }
  // });
};
