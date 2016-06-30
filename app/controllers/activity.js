var mongojs = require('mongojs');
var activityDB = mongojs('mongodb://localhost/dapsserver-development', ['activity']);

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
