'use strict';

var _controllers = require('../controllers');

var _controllers2 = _interopRequireDefault(_controllers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var orderController = _controllers2.default.Order;

module.exports = function (app) {
  app.get('/termsAndConditions', function (req, res) {
    res.render('termsandConditions');
  });
  app.get('/', orderController.homepage);
  app.post('/placeOrder', orderController.placeOrder1, orderController.homepage);
  app.all('*', orderController.homepage);
};