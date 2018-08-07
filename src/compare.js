var Immutable = require('immutable');
var parse = require('csv-parse');
var fs = require('fs');
var async = require('async');
var argvParser = require('argv-parser');

var isParsableConfiguration = require('./isParsableConfiguration');

var conform;
if (fs.existsSync('../adapters/dist/conform')) {
  conform = require('../adapters/dist/conform');
} else {
  conform = function(configuration) {
    return configuration;
  };
}
var adapterNew = require('../adapters/dist/new');
var adapterOriginal = require('../adapters/dist/original');

var cliArguments = argvParser.parse(process.argv, {
  rules: {
    data: {
      type: String
    }
  }
});

var stats = {
  invalid: 0,
  valid: 0,
  total: 0,
  incrementalMismatch: 0,
  columnsFrom: 0
};

var options = {
  delimiter: ',',
  columns: true
};

var parser = parse(options, function(err, data) {
  async.eachSeries(data, function(line, callback) {
    // do something with the line
    if (line.configuration) {
      var configuration = Immutable.fromJS(JSON.parse(line.configuration));
      var conformedConfiguration = conform(configuration);
      var parsableNew = isParsableConfiguration(conformedConfiguration, adapterNew.parseConfiguration, adapterNew.createConfiguration);
      var parsableOriginal = isParsableConfiguration(conformedConfiguration, adapterOriginal.parseConfiguration, adapterOriginal.createConfiguration);
      if (parsableOriginal === true && parsableNew === false) {
        stats.invalid++;
        if (line.configuration.lastIndexOf('"newFilesOnly":false') !== -1 && line.configuration.lastIndexOf('"incremental":true') !== -1 || line.configuration.lastIndexOf('"newFilesOnly":true') !== -1 && line.configuration.lastIndexOf('"incremental":false') !== -1) {
          stats.incrementalMismatch++;
        } else if (line.configuration.lastIndexOf('"columns_from":"auth"')) {
          stats.columnsFrom++;
        } else {
          console.log(JSON.stringify(conformedConfiguration.toJS()));
        }
        console.log(stats);
      } else {
        stats.valid++;
      }
      stats.total++;
    }
    callback();
  });
});

fs.createReadStream(cliArguments.parsed.data).pipe(parser);


