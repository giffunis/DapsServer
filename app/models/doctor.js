
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validators = require('mongoose-validators');

var DoctorSchema = new Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio']
  },
  password: {
    type: String,
    minlength: [6, 'La contraseña debe tener al menos 6 dígitos'],
    required: [true, 'La contraseña es obligatoria']
  },
  name_and_surname: {
    type: String,
    maxlength: [200, 'No existen nombres tan largos'],
    required: [true, 'El campo, nombre y apellidos, es obligatorio']
  },
  colegiado: {
    type: Number,
    max: [10, 'El número puesto, sobrepasa a los médicos colegiados en España'],
    required: [true, 'El número de colegiado es obligatorio']
  },
  especialidad: {
    type: String,
    maxlength: [100, 'El campo es demasiado grande']
  },
  email: {
    type: String,
    required: [true, 'Falta rellenar el campo: email'],
    validate: validators.isEmail()
  },
  mobile: {
    type: String,
    validate: {
      validator: function(phone){
        return /\s{+}\d{2}-\d{3}-\d{2}-\d{2}-\d{2}/.text(phone);
      },
      message:'{VALUE} No es un número válido, debe seguir la estructura: +XX-XXX-XX-XX-XX'
    }
  }
});

mongoose.model('Doctor', DoctorSchema);
