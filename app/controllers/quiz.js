var mongojs = require('mongojs');
var db = mongojs(config.db);
var testCollection = db.collection('quizes');
