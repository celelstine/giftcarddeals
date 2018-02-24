import formidable from 'formidable';
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
      .findAll()
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
    // create object from request
    const form = new formidable.IncomingForm();
    let productDetails;
    let imageUrl = null;
    const errorMessage = 'Sorry an error occurred, please try again';
    form.parse(req, (err, fields, files) => {
      productDetails = { ...fields };
    });
    /* eslint-disable no-param-reassign */
    form.on('fileBegin', (name, file) => {
      file.path = `${__dirname}/../../dist/productImages/${file.name}`;
      imageUrl = file.name;
    });

    form.on('error', (err) => {
      logger.error('An error occurred', err);
      return sendError(res, { errorMessage: `${err.message || err}` });
    });
    // send mail when every file has been inserted
    form.on('end', () => {
      productDetails = {
        ...productDetails,
        image_url: `productImages/${imageUrl}`,
      };
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
    });
  },
  updateProduct(req, res) {
    // create object from request
    const form = new formidable.IncomingForm();
    const productId = parseInt(req.params.productId, 10);
    let productDetails;
    let imageUrl = null;
    const errorMessage = 'Sorry an error occurred, please try again';
    form.parse(req, (err, fields, files) => {
      productDetails = { ...fields };
    });
    /* eslint-disable no-param-reassign */
    form.on('fileBegin', (name, file) => {
      file.path = `${__dirname}/../../dist/productImages/${file.name}`;
      imageUrl = file.name;
    });

    form.on('error', (err) => {
      logger.error('An error occurred', err);
      return sendError(res, { errorMessage: `${err.message || err}` });
    });
    // send mail when every file has been inserted
    form.on('end', () => {
      if (imageUrl) {
        productDetails = {
          ...productDetails,
          image_url: `productImages/${imageUrl}`,
        };
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
    });
  },
};
