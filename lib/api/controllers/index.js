'use strict';

var _auth = require('./auth');

var Auth = _interopRequireWildcard(_auth);

var _order = require('./order');

var Order = _interopRequireWildcard(_order);

var _product = require('./product');

var Product = _interopRequireWildcard(_product);

var _feedback = require('./feedback');

var Feedback = _interopRequireWildcard(_feedback);

var _staffEmail = require('./staffEmail');

var StaffEmail = _interopRequireWildcard(_staffEmail);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = {
  Auth: Auth,
  Order: Order,
  Product: Product,
  Feedback: Feedback,
  StaffEmail: StaffEmail
}; /**
    * file to centralise export of every controller
   */

// import each controller