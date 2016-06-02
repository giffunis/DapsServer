
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DoctorSchema = new Schema({
  username: String,
  password: S
});

mongoose.model('Doctor', DoctorSchema);
