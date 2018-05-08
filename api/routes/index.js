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
  app.get('/api/v1/ourRate', productController.ourRate);
  app.post('/api/v1/order', orderController.placeOrder);
  app.post('/api/v1/order1', orderController.placeOrder1);
  app.post('/api/v1/sendfeedback', feedbackController.sendFeedback);

  app.post('/api/v1/adminFeedback', feedbackController.SendAdminFeedback);
  // admin middleware here
  // app.use(adminPass);
  app.get('/api/v1/orders', adminPass, orderController.getOrders);
  app.post('/api/v1/products', adminPass, productController.addProduct);
  app.post('/api/v1/products/:productId', adminPass, productController.updateProduct);

  app.get('/api/v1/staffEmail', adminPass, StaffEmail.getStaffEmails);
  app.post('/api/v1/staffEmail', adminPass, StaffEmail.addStaffEmails);
  app.delete('/api/v1/staffEmail/:email', adminPass, StaffEmail.removeStaffEmails);

  app.get('/termsAndConditions', (req, res) => {
    res.render('termsandConditions');
  });
  app.post('/placeOrder', orderController.placeOrder1, orderController.homepage);
  app.all('*', orderController.homepage);
  
};
