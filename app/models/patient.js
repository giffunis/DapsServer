var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validators = require('mongoose-validators');
var uniqueValidator = require('mongoose-unique-validator');


var PatientSchema = new Schema({

});

PatientSchema.plugin(uniqueValidator, {message: 'El {PATH} ya se encuentra en uso'});
mongoose.model('Patient', PatientSchema);
