/**
 * file to centralise export of every controller
*/

// import each controller
import * as Auth from './auth';
import * as Order from './order';
import * as Product from './product';
import * as Feedback from './feedback';
import * as StaffEmail from './staffEmail';

module.exports = {
  Auth,
  Order,
  Product,
  Feedback,
  StaffEmail,
};
