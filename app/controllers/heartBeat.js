var mongojs = require('mongojs');
var heartBeatDB = mongojs('mongodb://localhost/dapsserver-development', ['heartbeats']);

exports.show = function(req,res){
  var id = req.query.search;
  console.log("Los datos que se buscan son: " + id);
  heartBeatDB.heartbeats.findOne({ _id: mongojs.ObjectId(id)}, function(err, doc) {
    if(err){
      console.log("No se ha encontrado el documento");
      res.send("Datos no encontrados");
    }else {
      console.log("Se ha encontrado el siguiente doc:\n" + doc);
      res.send(doc);
    }
  });
};
