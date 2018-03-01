import dotenv from 'dotenv';
import express from 'express';
import methodOverride from 'method-override';
// package to log error on console
import logger from 'morgan';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
// package to get request body
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

//import model from './api/db/models/index';
import routes from './api/routes';

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
// Lets us use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
// https://www.npmjs.com/package/method-override
app.use(methodOverride());

// serve static files in public folder
const publicPath = path.join(__dirname, 'lib/dist/');
app.use(express.static(publicPath));
// server compressed javascript file
app.get('*.js', (req, res, next) => {
  req.url = `${req.url}.gz`;
  res.set('Content-Encoding', 'gzip');
  next();
});

// Require all routes into the application.
routes(router);
app.use('/api/v1', router);

// seed the database
require('./api/db/seeders');

app.all('*', (req, res) => {
  console.log('serving, ', `${publicPath}index.html`);
  res.sendFile(`${publicPath}index.html`)
});

// catch errors
app.use((err, req, res, next) => {
  res.status(500).json({message: err.message, serving:  `${publicPath}index.html`});
});

// start server
const server = app.listen(app.get('port'),  () => {
  console.log("Server started on port", app.get('port'));
});

const io = require('socket.io').listen(server);
// expose socket to other route
app.set('socketio', io);
io.on('connection', (socket) => {
  console.log("Server socket  started on port", app.get('port'));
});
export default app;
