var userModels = require('66pix-users');
module.exports = function(options) {

  // Boilerplate
  var seneca = this;
  var pluginName = '66pix-users';

  options = seneca.util.deepextend({
    prefix: '/api/users/'
  });

  seneca.add({
    init: pluginName
  }, init);

  seneca.add({
    role: pluginName,
    cmd: 'current'
  }, current);

  seneca.act({
    role: 'web',
    use: {
      prefix: options.prefix,
      pin: {
        role: pluginName,
        cmd: '*'
      },
      map: {
        current: {
          GET: true
        }
      }
    }
  });

  return {
    name: pluginName
  };

  /**
   * Initialise user seneca plugin
   *
   * @param {Arguments} args
   * @param {Function} done
   */
  function init(args, done) {
    userModels.then(function() {
      done();
    })
    .catch(function(error) {
      throw error;
    });
  }

  // Actions
  /**
   * Get the currently logged in user
   *
   * @param {Arguments} args
   * @param {Function} done
   */
  function current(args, done) {
    done(null, {id: 123});
  }
};

