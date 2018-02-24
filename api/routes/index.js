import Controllers from '../controllers';
import {
  validateUser,
  adminPass,
} from '../controllers/utility';

// import the controllers
const authController = Controllers.Auth;
const orderController = Controllers.Order;
const productController = Controllers.Product;
const feedbackController = Controllers.Feedback;

module.exports = (app) => {
  // unathenticated routes
  app.post('/users/login', authController.login);
  app.post('/users/logout', authController.logout);
  app.post('/users/signup', authController.signup);

  // check for user session
  app.post(
    '/getUserwithRememberMeToken',
    authController.getUserwithRememberMeToken,
  );

  app.get('/ourRate', productController.ourRate);

  // protected routes start from here
  app.use(validateUser);

  app.post('/order', orderController.placeOrder);
  app.get('/orders', orderController.getOrders);
  app.post('/sendfeedback', feedbackController.sendFeedback);

  // admin middleware here
  app.use(adminPass);
  app.post('/products', productController.addProduct);
  app.post('/products/:productId', productController.updateProduct);

  app.all('*',
    (req, res) => res.status(404).json({ errorMessage: 'Unknown Route' }));
};
