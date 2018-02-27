import Controllers from '../controllers';
import {
  adminPass,
} from '../controllers/utility';

// import the controllers
const authController = Controllers.Auth;
const orderController = Controllers.Order;
const productController = Controllers.Product;
const feedbackController = Controllers.Feedback;
const StaffEmail = Controllers.StaffEmail;

module.exports = (app) => {
  // unathenticated routes
  app.post('/users/login', authController.login);
  app.post('/users/logout', authController.logout);
  app.post('/users/signup', authController.signup);

  app.post(
    '/getUserwithRememberMeToken',
    authController.getUserwithRememberMeToken,
  );
  app.get('/ourRate', productController.ourRate);
  app.post('/order', orderController.placeOrder);
  app.post('/sendfeedback', feedbackController.sendFeedback);

  // admin middleware here
  app.use(adminPass);
  app.get('/orders', orderController.getOrders);
  app.post('/products', productController.addProduct);
  app.post('/products/:productId', productController.updateProduct);

  app.get('/staffEmail', StaffEmail.getStaffEmails);
  app.post('/staffEmail', StaffEmail.addStaffEmails);
  app.delete('/staffEmail/:email', StaffEmail.removeStaffEmails);

  app.all('*',
    (req, res) => res.status(404).json({ errorMessage: 'Unknown Route' }));
};
