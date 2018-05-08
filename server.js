import dotenv from 'dotenv';
import express from 'express';
import hbs from 'express-hbs';
import methodOverride from 'method-override';
// package to log error on console
import logger from 'morgan';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
// package to get request body
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import routes from './api/routes';
import basicRoute from './api/routes/basicRoute';
import winstonlogger from './api/logger';

var contentType = require('content-type');
var getRawBody = require('raw-body');
// initailize dotenv
dotenv.config();

// create new express app
const app = express();

app.set('port', process.env.PORT || 1142);
const router = express.Router();
// use hemlet to disable settings that would leak security
app.use(helmet());
app.use(compression());


// Log requests to the console.
app.use(logger('dev'));
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: '20mb', }));
app.use(fileUpload());
// Lets us use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
// https://www.npmjs.com/package/method-override
app.use(methodOverride());

// serve static files in public folder
const publicPath = path.join(__dirname, 'dist/');
app.use(express.static(publicPath));
// set the view engine
app.set('view engine', 'hbs');

// configure the view engine 
app.engine('hbs', hbs.express4({  
  defaultLayout: __dirname + '/views/layouts/default.hbs',
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts',
  extname: ".hbs",
}));

// configure views path
app.set('views', path.join(__dirname,'/views'));

// server compressed javascript file
app.get('*.js', (req, res, next) => {
  req.url = `${req.url}.gz`;
  res.set('Content-Encoding', 'gzip');
  next();
});


app.all('/smartui', (req, res) => {
  res.sendFile(`${publicPath}template.html`)
});


// // register basic route
// basicRoute(router);
// app.use('/', router); 

// Require all routes into the application.
routes(router);
app.use('/', router);  




// catch errors
app.use((err, req, res, next) => {
  winstonlogger.error(err);
  res.status(500).json({message: err.message});
});

// start server
const server = app.listen(app.get('port'),  () => {
  winstonlogger.info("Server started on port", app.get('port'));
});

const io = require('socket.io').listen(server);
// expose socket to other route
app.set('socketio', io);
io.on('connection', (socket) => {});
export default app;
