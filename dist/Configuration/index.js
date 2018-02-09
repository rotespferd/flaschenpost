'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var os = require('os');

var cloneDeep = require('lodash/cloneDeep'),
    forEach = require('lodash/forEach'),
    forOwn = require('lodash/forOwn'),
    includes = require('lodash/includes'),
    keys = require('lodash/keys'),
    varname = require('varname');

var defaultLevels = require('../defaultLevels.json'),
    parseLogDebugModulesEnvironmentVariable = require('./parseLogDebugModulesEnvironmentVariable'),
    parseLogLevelsEnvironmentVariable = require('./parseLogLevelsEnvironmentVariable');

var Configuration = function () {
  function Configuration() {
    _classCallCheck(this, Configuration);

    this.setLevels(cloneDeep(defaultLevels));
    this.setHost(os.hostname());

    this.debugModules = parseLogDebugModulesEnvironmentVariable();
  }

  _createClass(Configuration, [{
    key: 'set',
    value: function set(key, options) {
      var fn = varname.camelback('set-' + key);

      if (!this[fn]) {
        throw new Error('Unknown key \'' + key + '\' specified.');
      }

      this[fn](options);
    }
  }, {
    key: 'setLevels',
    value: function setLevels(levels) {
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
        enabledLogLevels = keys(this.levels);
      }

      forEach(enabledLogLevels, function (enabledLogLevel) {
        if (!includes(keys(_this.levels), enabledLogLevel)) {
          throw new Error('Unknown log level ' + enabledLogLevel + '.');
        }
      });

      forOwn(this.levels, function (levelOptions, levelName) {
        levelOptions.enabled = includes(enabledLogLevels, levelName);
      });
    }
  }, {
    key: 'setHost',
    value: function setHost(host) {
      if (!host) {
        throw new Error('Host is missing.');
      }

      this.host = host;
    }
  }]);

  return Configuration;
}();

module.exports = Configuration;