var userModels = require('66pix-user');
module.exports = function(options) {
  var seneca = this;
  var name = '66pix-users';

  options = seneca.util.deepextend({
    prefix: '/users/'
  });

  seneca.add({
    init: name
  }, init);

  function init(args, done) {
    console.log('init');
    done();
  }
};

