'use strict';

var os = require('os');

var _ = require('lodash'),
    varname = require('varname');

var defaultLevels = require('../defaultLevels.json'),
    parseLogDebugModulesEnvironmentVariable = require('./parseLogDebugModulesEnvironmentVariable'),
    parseLogLevelsEnvironmentVariable = require('./parseLogLevelsEnvironmentVariable');

var Configuration = function Configuration() {
  this.setLevels(_.cloneDeep(defaultLevels));
  this.setHost(os.hostname());

  this.debugModules = parseLogDebugModulesEnvironmentVariable();
};

Configuration.prototype.set = function (key, options) {
  var fn = varname.camelback('set-' + key);

  if (!this[fn]) {
    throw new Error('Unknown key \'' + key + '\' specified.');
  }

  this[fn](options);
};

Configuration.prototype.setLevels = function (levels) {
  var _this = this;

  if (!levels) {
    throw new Error('Levels are missing.');
  }

  this.levels = levels;

  var enabledLogLevels = parseLogLevelsEnvironmentVariable();

  if (enabledLogLevels.length === 0) {
    return;
  }

  if (enabledLogLevels.length === 1 && enabledLogLevels[0] === '*') {
    enabledLogLevels = _.keys(this.levels);
  }

  _.forEach(enabledLogLevels, function (enabledLogLevel) {
    if (!_.includes(_.keys(_this.levels), enabledLogLevel)) {
      throw new Error('Unknown log level ' + enabledLogLevel + '.');
    }
  });

  _.forOwn(this.levels, function (levelOptions, levelName) {
    levelOptions.enabled = _.includes(enabledLogLevels, levelName);
  });
};

Configuration.prototype.setHost = function (host) {
  if (!host) {
    throw new Error('Host is missing.');
  }

  this.host = host;
};

module.exports = Configuration;