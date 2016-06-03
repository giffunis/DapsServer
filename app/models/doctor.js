
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validators = require('mongoose-validators');
var uniqueValidator = require('mongoose-unique-validator');

var DoctorSchema = new Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true
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
    required: [true, 'El número de colegiado es obligatorio'],
    unique: true
  },
  especialidad: {
    type: String,
    maxlength: [100, 'El campo es demasiado grande']
  },
  email: {
    type: String,
    required: [true, 'Falta rellenar el campo: email'],
    validate: validators.isEmail(),
    unique: true
  },
  mobile: {
    type: String,
    validate: {
      validator: function(phone){
        return /\d{3}-\d{2}-\d{2}-\d{2}/.test(phone);
      },
      message:'{VALUE} No es un número válido, debe seguir la estructura: XXX-XX-XX-XX'
    }
  }
});

DoctorSchema.plugin(uniqueValidator, { message: 'El {PATH} ya se encuentra en uso'});

mongoose.model('Doctor', DoctorSchema);
