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

//import model from './api/db/models/index';
import routes from './api/routes';
import winstonlogger from './api/logger';
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
const publicPath = path.join(__dirname, 'dist/');
app.use(express.static(publicPath));
// set the view engine
app.set('view engine', 'hbs');

// configure the view engine 
app.engine('hbs', hbs.express4({  
  defaultLayout: __dirname + '/views/layouts/default.hbs',
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts'
}));

// configure views path
app.set('views', path.join(__dirname,'/views'));

// server compressed javascript file
app.get('*.js', (req, res, next) => {
  req.url = `${req.url}.gz`;
  res.set('Content-Encoding', 'gzip');
  next();
});

// Require all routes into the application.
routes(router);
app.use('/api/v1', router);



app.all('/admin', (req, res) => {
  res.sendFile(`${publicPath}index.html`)
});

app.get('/termsAndConditions', (req, res) => {
  res.render('termsandConditions');
})
app.get('/', function(req, res) {  
  var user = {
    first: 'Brian',
    last: 'Mancini',
    site: 'http://derpturkey.com',
    age: 32
  }
  var products = [
    {"id":1,"name":"USA Itunes card","acronym":"usi","rate":220,"highDenominationRate":100,"isActive":true,"image_url":"https://www.exchangezone9ja.com/productImages/itunes-gift-card-pile.4728efc.png","extra":"","cardCurrency":"$","createdAt":"2018-03-07T16:22:35.000Z","updatedAt":"2018-05-01T17:19:33.000Z"},{"id":5,"name":"Steam Card","acronym":"StC","rate":225,"highDenominationRate":225,"isActive":true,"image_url":"https://www.exchangezone9ja.com/productImages/Steam-wallet-cards-south-africa.jpg","extra":"","cardCurrency":"$","createdAt":"2018-03-22T21:52:56.000Z","updatedAt":"2018-04-25T14:27:55.000Z"},{"id":6,"name":"Amazon Cards","acronym":"AMC","rate":240,"highDenominationRate":240,"isActive":true,"image_url":"https://www.exchangezone9ja.com/productImages/amazon-gift-cards-fanned.png","extra":"","cardCurrency":"$","createdAt":"2018-03-22T22:13:13.000Z","updatedAt":"2018-04-27T06:16:47.000Z"},{"id":7,"name":"Australian Itunes Card","acronym":"AIC","rate":120,"highDenominationRate":120,"isActive":true,"image_url":"https://www.exchangezone9ja.com/productImages/itunes-gift-card-pile.4728efc.png","extra":"","cardCurrency":"$","createdAt":"2018-03-23T06:58:24.000Z","updatedAt":"2018-04-18T08:40:08.000Z"},{"id":8,"name":"Canadian Itune Cards","acronym":"CIC","rate":120,"highDenominationRate":120,"isActive":true,"image_url":"https://www.exchangezone9ja.com/productImages/itunes-gift-card-pile.4728efc.png","extra":"","cardCurrency":"$","createdAt":"2018-03-23T06:59:16.000Z","updatedAt":"2018-04-18T08:40:01.000Z"}
  ];
  var banks = [
    'Access Bank',
    'Citibank',
    'Diamond Bank',
    'Ecobank Nigeria',
    'Enterprise Bank Limited',
    'Fidelity Bank Nigeria',
    'First Bank of Nigeria',
    'First City Monument Bank',
    'FSDH Merchant Bank',
    'Guaranty Trust Bank',
    'Heritage Bank Plc.',
    'Keystone Bank Limited',
    'Mainstreet Bank Limited',
    'Rand Merchant Bank',
    'Savannah Bank',
    'Skye Bank',
    'Stanbic IBTC Bank Nigeria Limited',
    'Standard Chartered Bank',
    'Sterling Bank',
    'Union Bank of Nigeria',
    'United Bank for Africa',
    'Unity Bank Plc.',
    'Wema Bank',
    'Zenith Bank',
  ];
  res.render('index', { user, products, banks });

});

// catch errors
app.use((err, req, res, next) => {
  winstonlogger.error(err);
  res.status(500).json({message: err.message, serving:  `${publicPath}index.html`});
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
