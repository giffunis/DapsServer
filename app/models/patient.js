var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validators = require('mongoose-validators');
var uniqueValidator = require('mongoose-unique-validator');


var PatientSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El {PATH} es obligatorio']
  },
  lastName: {
    type: String,
    required: [true, 'El {PATH} es obligatorio']
  },
  dni: {
    type: String,
    required: [true, 'El {PATH} es obligatorio'],
    unique: true,
    validate: {
      validator: function(dni){
        return /([a-z,A-Z]{1}\d{7}[a-z,A-Z]{1})|(\d{8}[a-z,A-Z]{1})/.test(dni);
      }
    }
  },
  sex: {
    type: String,
    required: [true, 'El {PATH} es obligatorio']
  },
  birthDate: {
    type: Date,
    required: [true, 'El {PATH} es obligatorio']
  },
  mobileNumber: {
    type: String,
    validate: {
      validator: function(phone){
        return /\d{3}-\d{2}-\d{2}-\d{2}/.test(phone);
      },
      message:'{VALUE} No es un número válido, debe seguir la estructura: XXX-XX-XX-XX'
    }
  },
  contactPerson: {
    type: String
  },
  personTlf: {
    type: String,
    validate: {
      validator: function(phone){
        return /\d{3}-\d{2}-\d{2}-\d{2}/.test(phone);
      },
      message:'{VALUE} No es un número válido, debe seguir la estructura: XXX-XX-XX-XX'
    }
  },
  smoker: {
    type: Boolean,
    required: [true, 'El {PATH} es obligatorio']
  },
  memoryProblems: {
    type: Boolean,
    required: [true, 'El {PATH} es obligatorio']
  },
  heartCondition: {
    type: Boolean,
    required: [true, 'El {PATH} es obligatorio']
  },
});

PatientSchema.plugin(uniqueValidator, {message: 'El {PATH} ya se encuentra en uso'});
mongoose.model('Patient', PatientSchema);
