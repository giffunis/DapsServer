var mongojs = require('mongojs');
var activityDB = mongojs('mongodb://localhost/dapsserver-development', ['activity']);

exports.show = function(req,res){
  var id = req.query.search;
  console.log("Los datos que se buscan son: " + id);
  activityDB.activity.findOne({ _id: mongojs.ObjectId(id)}, function(err, doc) {
    if(err){
      console.log("No se ha encontrado el documento");
      res.send("Datos no encontrados");
    }else {
      console.log("Se ha encontrado el siguiente doc:\n" + doc);

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

      var salida = {"label": "Actividad semanal", "data": data};

      res.send(salida);
    }
  });
};
