'use strict';

var _controllers = require('../controllers');

var _controllers2 = _interopRequireDefault(_controllers);

var _utility = require('../controllers/utility');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import the controllers
var authController = _controllers2.default.Auth;
var orderController = _controllers2.default.Order;
var productController = _controllers2.default.Product;
var feedbackController = _controllers2.default.Feedback;
var StaffEmail = _controllers2.default.StaffEmail;

module.exports = function (app) {
  // unathenticated routes
  app.post('/users/login', authController.login);
  app.post('/users/logout', authController.logout);
  app.post('/users/signup', authController.signup);

  app.post('/getUserwithRememberMeToken', authController.getUserwithRememberMeToken);
  app.get('/ourRate', productController.ourRate);
  app.post('/order', orderController.placeOrder);
  app.post('/sendfeedback', feedbackController.sendFeedback);

  // admin middleware here
  app.use(_utility.adminPass);
  app.get('/orders', orderController.getOrders);
  app.post('/products', productController.addProduct);
  app.post('/products/:productId', productController.updateProduct);

  app.get('/staffEmail', StaffEmail.getStaffEmails);
  app.post('/staffEmail', StaffEmail.addStaffEmails);
  app.delete('/staffEmail/:email', StaffEmail.removeStaffEmails);

  app.all('*', function (req, res) {
    return res.status(404).json({ errorMessage: 'Unknown Route' });
  });
};