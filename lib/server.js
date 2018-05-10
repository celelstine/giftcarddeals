'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHbs = require('express-hbs');

var _expressHbs2 = _interopRequireDefault(_expressHbs);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressFileupload = require('express-fileupload');

var _expressFileupload2 = _interopRequireDefault(_expressFileupload);

var _routes = require('./api/routes');

var _routes2 = _interopRequireDefault(_routes);

var _logger = require('./api/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// package to get request body

// package to log error on console
var contentType = require('content-type');
var getRawBody = require('raw-body');
// initailize dotenv
_dotenv2.default.config();

// create new express app
var app = (0, _express2.default)();

app.set('port', process.env.PORT || 1142);
var router = _express2.default.Router();

app.use(function (req, res, next) {
  var blockedIps = [];
  _logger2.default.info("ip", req.ip);
  if (blockedIps.indexOf(req.ip) === -1) next();else return res.status(403).end('forbidden');
});
// use hemlet to disable settings that would leak security
app.use((0, _helmet2.default)());
app.use((0, _compression2.default)());

// Log requests to the console.
app.use((0, _morgan2.default)('dev'));
// Parse incoming requests data
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false, limit: '20mb' }));
app.use((0, _expressFileupload2.default)());
// Lets us use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
// https://www.npmjs.com/package/method-override
app.use((0, _methodOverride2.default)());

// serve static files in public folder
var publicPath = _path2.default.join(__dirname, 'dist/');
app.use(_express2.default.static(publicPath));
// set the view engine
app.set('view engine', 'hbs');

// configure the view engine 
app.engine('hbs', _expressHbs2.default.express4({
  defaultLayout: __dirname + '/views/layouts/default.hbs',
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts',
  extname: ".hbs"
}));

// configure views path
app.set('views', _path2.default.join(__dirname, '/views'));

// server compressed javascript file
app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});

app.all('/smartui', function (req, res) {
  res.sendFile(publicPath + 'template.html');
});

// Require all routes into the application.
(0, _routes2.default)(router);
app.use('/', router);

// catch errors
app.use(function (err, req, res, next) {
  _logger2.default.error(err);
  res.status(500).json({ message: err.message });
});

// start server
var server = app.listen(app.get('port'), function () {
  _logger2.default.info("Server started on port", app.get('port'));
});

var io = require('socket.io').listen(server);
// expose socket to other route
app.set('socketio', io);
io.on('connection', function (socket) {});
exports.default = app;