var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'dapsserver'
    },
    port: process.env.PORT || 3000,
    portSecure: process.env.PORT || 4000,
    db: 'mongodb://localhost/dapsserver-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'dapsserver'
    },
    port: process.env.PORT || 3000,
    portSecure: process.env.PORT || 4000,
    db: 'mongodb://localhost/dapsserver-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'dapsserver'
    },
    port: process.env.PORT || 3000,
    portSecure: process.env.PORT || 4000,
    db: 'mongodb://localhost/dapsserver-production'
  }
};

module.exports = config[env];
