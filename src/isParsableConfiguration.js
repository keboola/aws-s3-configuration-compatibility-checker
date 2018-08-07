var Immutable = require('immutable');

module.exports = function(configuration, parseFunction, createFunction) {
  if (configuration.isEmpty()) {
    return true;
  }
  var parsed = parseFunction(configuration);
  var reconstructed = createFunction(parsed);
  return Immutable.is(configuration, reconstructed);
};
