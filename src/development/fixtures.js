'use strict';

var path = require('path');

if (process.env.NODE_ENV !== 'development') {
  return;
}

require('66pix-models')
  .then(function(models) {
    var sequelizeFixtures = require('sequelize-fixtures');
    var models = {
      User: models.User
    };

    sequelizeFixtures.loadFile(path.join(__dirname, 'fixtures/**/*.json'), models);
  });
