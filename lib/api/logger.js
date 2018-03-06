'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var level = process.env.LOG_LEVEL || 'warning';

exports.default = new _winston2.default.Logger({
  transports: [new _winston2.default.transports.Console({
    level: level,
    timestamp: function timestamp() {
      return new Date().toISOString();
    }
  }), new _winston2.default.transports.File({ filename: 'server.log' })]
});