import model from '../db/models/index';
import logger from '../logger';
import {
  sendResult,
  sendError,
} from './utility';

const ProductPrice = model.productPrice;

/* eslint-disable no-unused-vars */
module.exports = {
  /* eslint-disable consistent-return  */
  ourRate(req, res) {
    ProductPrice
      .findAll({
        where: {
          isActive: true,
        },
      })
      .then(products => sendResult(res, { products }))
      .catch((error) => {
        logger.error('An error occurred', error);
        return sendError(
          res,
          { errorMessage: 'An  error occurred, please try again' },
        );
      });
  },
  addProduct(req, res) {
    const errorMessage = 'Sorry an error occurred, please try again';
    let cardimage = null;
    let imageUrl = null;
    // check if file was uploaded
    if (req.files && req.files.cardimage) {
      cardimage = req.files.cardimage;
      imageUrl = cardimage.name;
      // Use the mv() method to place the file somewhere on your server
      cardimage.mv(`${__dirname}/../../dist/productImages/${cardimage.name}`,
        (err) => {
          if (err) {
            logger.error('An error occurred', err);
            return sendError(res, { errorMessage });
          }
        });
    }
    const {
      name,
      rate,
      cardCurrency,
      extra,
      bulkrate,
      isActive,
    } = req.body;
    const productDetails = {
      name,
      rate,
      cardCurrency,
      extra,
      bulkrate,
      isActive,
    };
    if (req.files && req.files.cardimage) {
      productDetails['image_url'] = `productImages/${imageUrl}`;
    }
    ProductPrice.create(productDetails)
      .then((addedProduct) => {
        // send socket message to all client
        req.app.get('socketio')
          .emit('newProduct', addedProduct.dataValues);
        return sendResult(res, addedProduct.dataValues);
      })
      .catch((error) => {
        logger.error('An error occurred', error);
        return sendError(res, { errorMessage });
      });
  },
  updateProduct(req, res) {
    const productId = parseInt(req.params.productId, 10);
    const errorMessage = 'Sorry an error occurred, please try again';
    let cardimage = null;
    let imageUrl = null;
    // check if file was uploaded
    if (req.files && req.files.cardimage) {
      cardimage = req.files.cardimage;
      imageUrl = cardimage.name;

      // Use the mv() method to place the file somewhere on your server
      cardimage.mv(`${__dirname}/../../dist/productImages/${cardimage.name}`,
        (err) => {
          if (err) {
            logger.error('An error occurred', err);
            return sendError(res, { errorMessage });
          }
        });
    }
    const {
      name,
      rate,
      cardCurrency,
      extra,
      isActive,
      bulkrate,
    } = req.body;

    const productDetails = {
      name,
      rate,
      cardCurrency,
      extra,
      isActive,
      bulkrate,
    };
    if (req.files && req.files.cardimage) {
      productDetails['image_url'] = `productImages/${imageUrl}`;
    }
    ProductPrice.findOne({
      where: { id: productId },
    })
      .then((product) => {
        if (!product) {
          return sendError(res, { errorMessage });
        }
        return product
          .update(productDetails)
          .then((updatedproduct) => {
            // send socket message to all client
            req.app.get('socketio')
              .emit('ProductUpdate', updatedproduct.dataValues);
            return sendResult(res, updatedproduct.dataValues);
          })
          .catch((error) => {
            logger.error('An error occurred', error);
            return sendError(res, { errorMessage });
          });
      })
      .catch((error) => {
        logger.error('An error occurred', error);
        return sendError(res, { errorMessage });
      });
  },
};
