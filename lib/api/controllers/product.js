'use strict';

var _index = require('../db/models/index');

var _index2 = _interopRequireDefault(_index);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _utility = require('./utility');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProductPrice = _index2.default.productPrice;

/* eslint-disable no-unused-vars */
module.exports = {
  /* eslint-disable consistent-return  */
  ourRate: function ourRate(req, res) {
    ProductPrice.findAll({
      where: {
        isActive: true
      }
    }).then(function (products) {
      return (0, _utility.sendResult)(res, { products: products });
    }).catch(function (error) {
      _logger2.default.error('An error occurred', error);
      return (0, _utility.sendError)(res, { errorMessage: 'An  error occurred, please try again' });
    });
  },
  addProduct: function addProduct(req, res) {
    var errorMessage = 'Sorry an error occurred, please try again';
    var cardimage = null;
    var imageUrl = null;
    // check if file was uploaded
    if (req.files && req.files.cardimage) {
      cardimage = req.files.cardimage;
      imageUrl = cardimage.name;
      // Use the mv() method to place the file somewhere on your server
      cardimage.mv(__dirname + '/../../dist/productImages/' + cardimage.name, function (err) {
        if (err) {
          _logger2.default.error('An error occurred', err);
          return (0, _utility.sendError)(res, { errorMessage: errorMessage });
        }
      });
    }
    var _req$body = req.body,
        name = _req$body.name,
        rate = _req$body.rate,
        cardCurrency = _req$body.cardCurrency,
        extra = _req$body.extra,
        bulkrate = _req$body.bulkrate,
        isActive = _req$body.isActive;

    var productDetails = {
      name: name,
      rate: rate,
      cardCurrency: cardCurrency,
      extra: extra,
      bulkrate: bulkrate,
      isActive: isActive
    };
    if (req.files && req.files.cardimage) {
      productDetails['image_url'] = 'productImages/' + imageUrl;
    }
    ProductPrice.create(productDetails).then(function (addedProduct) {
      // send socket message to all client
      req.app.get('socketio').emit('newProduct', addedProduct.dataValues);
      return (0, _utility.sendResult)(res, addedProduct.dataValues);
    }).catch(function (error) {
      _logger2.default.error('An error occurred', error);
      return (0, _utility.sendError)(res, { errorMessage: errorMessage });
    });
  },
  updateProduct: function updateProduct(req, res) {
    var productId = parseInt(req.params.productId, 10);
    var errorMessage = 'Sorry an error occurred, please try again';
    var cardimage = null;
    var imageUrl = null;
    // check if file was uploaded
    if (req.files && req.files.cardimage) {
      cardimage = req.files.cardimage;
      imageUrl = cardimage.name;

      // Use the mv() method to place the file somewhere on your server
      cardimage.mv(__dirname + '/../../dist/productImages/' + cardimage.name, function (err) {
        if (err) {
          _logger2.default.error('An error occurred', err);
          return (0, _utility.sendError)(res, { errorMessage: errorMessage });
        }
      });
    }
    var _req$body2 = req.body,
        name = _req$body2.name,
        rate = _req$body2.rate,
        cardCurrency = _req$body2.cardCurrency,
        extra = _req$body2.extra,
        isActive = _req$body2.isActive,
        bulkrate = _req$body2.bulkrate;


    var productDetails = {
      name: name,
      rate: rate,
      cardCurrency: cardCurrency,
      extra: extra,
      isActive: isActive,
      bulkrate: bulkrate
    };
    if (req.files && req.files.cardimage) {
      productDetails['image_url'] = 'productImages/' + imageUrl;
    }
    ProductPrice.findOne({
      where: { id: productId }
    }).then(function (product) {
      if (!product) {
        return (0, _utility.sendError)(res, { errorMessage: errorMessage });
      }
      return product.update(productDetails).then(function (updatedproduct) {
        // send socket message to all client
        req.app.get('socketio').emit('ProductUpdate', updatedproduct.dataValues);
        return (0, _utility.sendResult)(res, updatedproduct.dataValues);
      }).catch(function (error) {
        _logger2.default.error('An error occurred', error);
        return (0, _utility.sendError)(res, { errorMessage: errorMessage });
      });
    }).catch(function (error) {
      _logger2.default.error('An error occurred', error);
      return (0, _utility.sendError)(res, { errorMessage: errorMessage });
    });
  }
};