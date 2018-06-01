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
  app.post('/api/v1/users/login', authController.login);
  app.post('/api/v1/users/logout', authController.logout);
  app.post('/api/v1/users/signup', authController.signup);

  app.post('/api/v1/getUserwithRememberMeToken', authController.getUserwithRememberMeToken);
  app.get('/api/v1/ourRate', productController.ourRate);
  app.post('/api/v1/order', orderController.placeOrder);
  app.post('/api/v1/order1', orderController.placeOrder1);
  app.post('/api/v1/sendfeedback', feedbackController.sendFeedback);

  app.post('/api/v1/adminFeedback', feedbackController.SendAdminFeedback);

  // admin middleware here
  // app.use(adminPass);
  app.get('/api/v1/orders', _utility.adminPass, orderController.getOrders);
  app.post('/api/v1/products', _utility.adminPass, productController.addProduct);
  app.post('/api/v1/products/:productId', _utility.adminPass, productController.updateProduct);

  app.get('/api/v1/staffEmail', _utility.adminPass, StaffEmail.getStaffEmails);
  app.post('/api/v1/staffEmail', _utility.adminPass, StaffEmail.addStaffEmails);
  app.delete('/api/v1/staffEmail/:email', _utility.adminPass, StaffEmail.removeStaffEmails);

  app.get('/termsAndConditions', function (req, res) {
    res.render('termsandConditions');
  });
  app.post('/placeOrder', orderController.placeOrder1);
  app.all('*', orderController.homepage);
};