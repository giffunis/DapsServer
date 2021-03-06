exports.loginRequired = function(req,res,next){
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

exports.new = function (req, res){
  var errors = req.session.errors || {};
  req.session.errors = {};
  res.render('pages/login', {errors: errors});
};

exports.create = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var doctorController = require('./doctor');
  doctorController.autenticar(username, password, function (error, user) {
    if (error) {
      req.session.errors = [{"message": error.message}];
      res.redirect('/login');
      return;
    }
    req.session.user = {_id: user._id, username: user.username};
    console.log("el usuario se ha validado correctamente");


        res.redirect('/doctor/');
  

  });
};

exports.destroy = function(req, res){
  delete req.session.user;
  res.redirect('/');
};
