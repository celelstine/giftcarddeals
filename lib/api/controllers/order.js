'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _index = require('../db/models/index');

var _index2 = _interopRequireDefault(_index);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _utility = require('./utility');

var _modelUtility = require('./modelUtility');

var _validators = require('../../api/controllers/validators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Order = _index2.default.order;
var StaffEmail = _index2.default.staffemail;
var ProductPrice = _index2.default.productPrice;

var errorMessage = 'Sorry an error occurred, please try again';

/* eslint-disable no-unused-vars */
module.exports = {
  /* eslint-disable consistent-return  */
  placeOrder: function placeOrder(req, res) {
    // create object from request
    var incomingFiles = req.files['uploadedCards[]'];
    var attachments = [];
    var giftcardsUrl = '';
    var randomFilename = void 0;
    if (incomingFiles.length) {
      incomingFiles.forEach(function (file) {
        randomFilename = (0, _modelUtility.genereateOrderNumber)() + file.name;
        // file.mv(`${__dirname}/../../giftcards/${randomFilename}`,
        //   (err) => {
        //     if (err) {
        //       logger.error('An error occurred', err);
        //     }
        //   });
        // build the url for all files
        giftcardsUrl += 'nngiftCards/' + randomFilename + '||';
        attachments.push({
          filename: file.name,
          content: new Buffer(file.data)
        });
      });
    } else {
      attachments = { // binary buffer as an attachment
        filename: incomingFiles.name,
        content: new Buffer(incomingFiles.data)
      };
    }
    var _req$body = req.body,
        acronym = _req$body.acronym,
        bankName = _req$body.bankName,
        bankAccountName = _req$body.bankAccountName,
        bankAccountNumber = _req$body.bankAccountNumber,
        email = _req$body.email,
        extra = _req$body.extra,
        highDenominationRate = _req$body.highDenominationRate,
        rate = _req$body.rate,
        cardDenomination = _req$body.cardDenomination,
        productName = _req$body.productName,
        cardCurrency = _req$body.cardCurrency;


    var orderId = (0, _modelUtility.genereateOrderNumber)(acronym);
    var orderObject = {
      bankName: bankName,
      bankAccountName: bankAccountName,
      bankAccountNumber: bankAccountNumber,
      email: email,
      extra: extra,
      rate: rate,
      highDenominationRate: highDenominationRate,
      productName: productName,
      cardCurrency: cardCurrency,
      orderId: orderId,
      subject: 'New order from ' + email,
      giftcardsUrl: giftcardsUrl
    };
    var mailTransporter = _nodemailer2.default.createTransport({
      host: 'mail.exchangezone9ja.com',
      port: 25,
      auth: {
        user: process.env.SEND_GIFTCARD_MAIL,
        pass: process.env.SEND_GIFTCARD_MAIL_PASSWORD
      }
    });
    var text = '\n      Card Details\n      ---------------------------------\n      Card type: ' + productName + '\n      Rate: ' + rate + '\n      High Denomination rate: ' + highDenominationRate + '\n      Card Denomination: ' + cardDenomination + '\n\n      Bank Details\n      -----------------------------------\n      Bank Name: ' + bankName + '\n      Bank Account Number: ' + bankAccountNumber + '\n      Bank Account Name: ' + bankAccountName + '\n\n      Extra\n      ------------------------------------\n      ' + extra + '\n    ';
    StaffEmail.findAll({
      attributes: ['email']
    }).then(function (emails) {
      if (!emails.length) {
        _logger2.default.error('error', 'The staff Email table is empty');
        return (0, _utility.sendError)(res, { errorMessage: errorMessage });
      }
      var emailList = [];
      emails.forEach(function (staff) {
        return emailList.push(staff.email);
      });
      var mailPayload = {
        sender: process.env.SEND_GIFTCARD_MAIL,
        from: process.env.SEND_GIFTCARD_MAIL,
        to: process.env.ADMIN_MAIL,
        replyTo: process.env.SEND_GIFTCARD_MAIL,
        date: new Date(),
        bcc: emailList,
        subject: 'order from ' + email + ', Order ID ' + orderId,
        text: text,
        attachments: attachments
      };
      mailTransporter.sendMail(mailPayload, function (error, info) {
        if (error) {
          _logger2.default.error('error', 'An error occurred', error);
          return (0, _utility.sendError)(res, { errorMessage: errorMessage });
        }
        // send mail to user email
        mailPayload = {
          sender: process.env.SEND_GIFTCARD_MAIL,
          from: process.env.SEND_GIFTCARD_MAIL,
          to: email,
          replyTo: process.env.SEND_GIFTCARD_MAIL,
          date: new Date(),
          subject: 'Your order has been recieved, Order ID ' + orderId,
          text: '\n              You order with order ID ' + orderId + ' has been recieved.\n              We would load the cards and transfer the money to your account.\n              Our average response time is 10 times.\n              Your can contact us via ' + process.env.FEEDBACK_MAIL + ' or 08149677155\n    \n              thanks for choosing us.\n    \n              ' + text + '\n            ',
          html: '\n              <div\n                style="\n                  font-family: Helvetica, sans-serif;\n                  padding: 0.01em 16px;\n                  max-width: 800px;\n                  color: black\n                  "\n              >\n                <h6\n                  style="\n                  color: #fff!important;\n                  background-color: #ff5722!important;\n                  font-size: larger;\n                  padding: 5px 5px; \n                  margin-bottom: 5px\n                ">\n                  You order with order ID <span style="text-decoration: underline;">\n                  ' + orderId + '</span> has been recieved\n                </h6>\n                <div \n                  style="\n                    text-align: justify;\n                    text-justify: inter-word;\n                  "\n                >\n                  <p>\n                    We would load the cards and transfer the money to your account.\n                      Our average response time is 10 minutes.\n                  </p>\n                  <h4 style="text-decoration: underline; margin: 0px"> Card Details </h4>\n                  Card Type: ' + productName + ' <br />\n                  Rate: ' + rate + ' <br />\n                  High Denomination Rate: ' + highDenominationRate + ' <br />\n\n                  <h4 style="text-decoration: underline; margin: 0px"> Bank Details </h4>\n                  Bank Name:  ' + bankName + ' <br />\n                  Bank Account Number:  ' + bankAccountNumber + ' <br />\n                  Bank Account Name: ' + bankAccountName + ' <br />\n                  <p>\n                    You can contact us via\n                    <span style="text-decoration: underline;">\n                    ' + process.env.FEEDBACK_MAIL + '\n                    </span>\n                    or ' + process.env.ADMIN_PHONE + '\n                    whatsapp only \xBB ' + process.env.ADMIN_WHATSAPP_NUMBER + '\n                  </p>\n                  <p>Thanks for choosing us.<p>\n                  <p>\n                    ExchangeZone9ja <span style="float: right"> \n                    ' + new Date().toLocaleDateString('en-US') + '\n                    </span>\n                  </p>\n                </div>\n              </div>\n            '
        };
        mailTransporter.sendMail(mailPayload, function (err, info1) {
          if (err) {
            _logger2.default.error('error', 'An error occurred', err);
            return (0, _utility.sendError)(res, { errorMessage: errorMessage });
          }
          Order.create(orderObject).then(function () {
            // send response to client
            var payload = {
              orderId: orderId,
              status: 'Pending'
            };
            return (0, _utility.sendResult)(res, payload);
          }).catch(function (error1) {
            _logger2.default.error('error', 'An error occurred', error1);
            return (0, _utility.sendError)(res, { errorMessage: errorMessage });
          });
        });
      });
    }).catch(function (error) {
      _logger2.default.error('An error occurred', error);
      return (0, _utility.sendError)(res, { errorMessage: 'An  error occurred, please try again' });
    });
  },

  // getClientOrders(req, res) {
  //   Order.findAll({
  //     where: {
  //       clientId: req.user.userId,
  //     },
  //     attributes: [
  //       'id',
  //       'status',
  //       'orderId',
  //       'rate',
  //       'highDenominationRate',
  //       'productName',
  //       'cardCurrency',
  //       'email',
  //       'bankName',
  //       'bankAccountNumber',
  //       'bankAccountName',
  //       'createdAt',
  //     ],
  //   })
  //     .then(orders => sendResult(res, orders))
  //     .catch((error) => {
  //       logger.error('error', 'An error occurred', error);
  //       return sendError(res, { errorMessage });
  //     });
  // },
  getOrders: function getOrders(req, res) {
    var limit = parseInt(req.query.limit, 10) || 10;
    var offset = parseInt(req.query.offset, 10) || 0;
    var query = {};
    if (req.query.orderId) {
      query.orderId = req.query.orderId;
    }

    Order.findAndCountAll({
      where: (0, _extends3.default)({}, query),
      offset: offset,
      limit: limit,
      order: [['id', 'DESC']],
      attributes: ['id', 'status', 'orderId', 'rate', 'highDenominationRate', 'productName', 'cardCurrency', 'email', 'bankName', 'bankAccountNumber', 'bankAccountName', 'createdAt', 'giftcardsUrl']
    }).then(function (orders) {
      if (orders.pageSize) {
        return (0, _utility.sendError)(res, { errorMessage: 'No record was found.' }, 409);
      }
      var count = orders.count;
      var rows = orders.rows;
      var pageCount = parseInt(count / limit, 10);
      if (pageCount < count / limit) {
        pageCount += 1;
      }
      var ordersPayload = {
        count: count,
        orders: rows,
        curPage: parseInt(offset / limit, 10) + 1,
        pageCount: pageCount,
        pageSize: rows.length
      };
      return (0, _utility.sendResult)(res, ordersPayload);
    }).catch(function (error) {
      _logger2.default.error('error', 'An error occurred', error);
      return (0, _utility.sendError)(res, { errorMessage: errorMessage });
    });
  },
  placeOrder1: function placeOrder1(req, res) {
    // create object from request
    var _req$body2 = req.body,
        card = _req$body2.card,
        bankName = _req$body2.bankName,
        bankAccountName = _req$body2.bankAccountName,
        bankAccountNumber = _req$body2.bankAccountNumber,
        email = _req$body2.email,
        extra = _req$body2.extra,
        cardDenomination = _req$body2.cardDenomination;
    // validate inputs

    var inputValidationMessage = '';
    if (!email || !(0, _validators.isValidEmail)(email)) {
      inputValidationMessage = '*Please provide a valid email \n';
    }
    if (!bankAccountNumber || !(0, _validators.isValidAccountNumber)(bankAccountNumber)) {
      inputValidationMessage += '*Please provide a valid Account Number (10 digits)\n';
    }

    if (!bankAccountName || !(0, _validators.isValidFullName)(bankAccountName)) {
      inputValidationMessage += '*Please provide a valid Account Name (at least two name)\n';
    }
    if (!card || card.split('/').length !== 3) {
      inputValidationMessage += '* Please select a card category and denomination. \n';
    }
    if (!req.files || !req.files['uploadedCards[]'] || req.files['uploadedCards[]'].length > 10) {
      inputValidationMessage += '* You can only upload up to 10 images, combine the card if you have more than 10 images. \n';
    }
    var incomingFiles = req.files['uploadedCards[]'];
    var attachments = [];
    var giftcardsUrl = '';
    var randomFilename = void 0;
    if (inputValidationMessage) {
      return res.redirect('/?message=' + inputValidationMessage);
    }
    if (incomingFiles.length) {
      var fileSize = 0;
      incomingFiles.forEach(function (file) {
        randomFilename = (0, _modelUtility.genereateOrderNumber)() + file.name;
        // file.mv(`${__dirname}/../../giftcards/${randomFilename}`,
        //   (err) => {
        //     if (err) {
        //       logger.error('An error occurred', err);
        //     }
        //   });
        // build the url for all files
        giftcardsUrl += 'nngiftCards/' + randomFilename + '||';
        fileSize += file.data.length;
        // if the file size is more than 20mb
        if (fileSize > 1 * 1024 * 1024) {
          inputValidationMessage += '* You can only upload up to 20mb, combine the card if you have more than 10 images.';
          return res.redirect('/?message=' + inputValidationMessage);
        }
        attachments.push({
          filename: file.name,
          content: new Buffer(file.data)
        });
      });
    } else {
      if (incomingFiles.data.length > 20 * 1024 * 1024) {
        inputValidationMessage += '* You can only upload up to 20mb, combine the card if you have more than 10 images.';
        return res.redirect('/?message=' + inputValidationMessage);
      }
      attachments = { // binary buffer as an attachment
        filename: incomingFiles.name,
        content: new Buffer(incomingFiles.data)
      };
    }

    var orderId = (0, _modelUtility.genereateOrderNumber)();
    var rateRecords = card.split('/');
    var rate = rateRecords[0];
    var highDenominationRate = rateRecords[1];
    var cardCurrency = '$';
    var productName = '';
    switch (rateRecords[2]) {
      case 'Australian':
      case 'Canadian':
      case 'USA':
        productName = rateRecords[2] + ' Itunes Card';
        break;
      case 'Amazon':
      case 'Steam':
        productName = rateRecords[2] + ' Card';
        break;
      default:
        break;
    }
    var orderObject = {
      bankName: bankName,
      bankAccountName: bankAccountName,
      bankAccountNumber: bankAccountNumber,
      email: email,
      extra: extra,
      rate: rate,
      highDenominationRate: highDenominationRate,
      productName: productName,
      cardCurrency: cardCurrency,
      orderId: orderId,
      subject: 'New order from ' + email,
      giftcardsUrl: giftcardsUrl
    };
    var mailTransporter = _nodemailer2.default.createTransport({
      host: 'mail.exchangezone9ja.com',
      port: 25,
      auth: {
        user: process.env.SEND_GIFTCARD_MAIL,
        pass: process.env.SEND_GIFTCARD_MAIL_PASSWORD
      }
    });
    var text = '\n      Card Details\n      ---------------------------------\n      Card type: ' + productName + '\n      Rate: \u20A6' + rate + '/$\n      High Denomination rate: \u20A6' + highDenominationRate + '/$\n      Card Denomination: ' + cardDenomination + '\n\n      Bank Details\n      -----------------------------------\n      Bank Name: ' + bankName + '\n      Bank Account Number: ' + bankAccountNumber + '\n      Bank Account Name: ' + bankAccountName + '\n\n      Extra\n      ------------------------------------\n      ' + extra + '\n    ';
    StaffEmail.findAll({
      attributes: ['email']
    }).then(function (emails) {
      if (!emails.length) {
        _logger2.default.error('error', 'The staff Email table is empty');
        return res.redirect('/?message=An  error occurred, please try again');
      }
      var emailList = [];
      emails.forEach(function (staff) {
        return emailList.push(staff.email);
      });
      var mailPayload = {
        sender: process.env.SEND_GIFTCARD_MAIL,
        from: process.env.SEND_GIFTCARD_MAIL,
        to: process.env.ADMIN_MAIL,
        replyTo: process.env.SEND_GIFTCARD_MAIL,
        date: new Date(),
        bcc: emailList,
        subject: 'order from ' + email + ', Order ID ' + orderId,
        text: text,
        attachments: attachments
      };
      mailTransporter.sendMail(mailPayload, function (error, info) {
        if (error) {
          _logger2.default.error('error', 'An error occurred', error);
          return res.redirect('/?message=An  error occurred, please try again');
        }
        // send mail to user email
        mailPayload = {
          sender: process.env.SEND_GIFTCARD_MAIL,
          from: process.env.SEND_GIFTCARD_MAIL,
          to: email,
          replyTo: process.env.SEND_GIFTCARD_MAIL,
          date: new Date(),
          subject: 'Your order has been recieved, Order ID ' + orderId,
          text: '\n              You order with order ID ' + orderId + ' has been recieved.\n              We would load the cards and transfer the money to your account.\n              Our average response time is 10 times.\n              Your can contact us via ' + process.env.FEEDBACK_MAIL + ' or 08149677155\n    \n              thanks for choosing us.\n    \n              ' + text + '\n            ',
          html: '\n              <div\n                style="\n                  font-family: Helvetica, sans-serif;\n                  padding: 0.01em 16px;\n                  max-width: 800px;\n                  color: black\n                  "\n              >\n                <h6\n                  style="\n                  color: #fff!important;\n                  background-color: #ff5722!important;\n                  font-size: larger;\n                  padding: 5px 5px; \n                  margin-bottom: 5px\n                ">\n                  You order with order ID <span style="text-decoration: underline;">\n                  ' + orderId + '</span> has been recieved\n                </h6>\n                <div \n                  style="\n                    text-align: justify;\n                    text-justify: inter-word;\n                  "\n                >\n                  <p>\n                    We would load the cards and transfer the money to your account.\n                      Our average response time is 10 minutes.\n                  </p>\n                  <h4 style="text-decoration: underline; margin: 0px"> Card Details </h4>\n                  Card Type: ' + productName + ' <br />\n                  Rate: ' + rate + ' <br />\n                  High Denomination Rate: ' + highDenominationRate + ' <br />\n\n                  <h4 style="text-decoration: underline; margin: 0px"> Bank Details </h4>\n                  Bank Name:  ' + bankName + ' <br />\n                  Bank Account Number:  ' + bankAccountNumber + ' <br />\n                  Bank Account Name: ' + bankAccountName + ' <br />\n                  <p>\n                    You can contact us via\n                    <span style="text-decoration: underline;">\n                    ' + process.env.FEEDBACK_MAIL + '\n                    </span>\n                    or ' + process.env.ADMIN_PHONE + '\n                    whatsapp only \xBB ' + process.env.ADMIN_WHATSAPP_NUMBER + '\n                  </p>\n                  <p>Thanks for choosing us.<p>\n                  <p>\n                    ExchangeZone9ja <span style="float: right"> \n                    ' + new Date().toLocaleDateString('en-US') + '\n                    </span>\n                  </p>\n                </div>\n              </div>\n            '
        };
        mailTransporter.sendMail(mailPayload, function (err, info1) {
          if (err) {
            return res.redirect('/?message=An  error occurred, please try again');
          }
          Order.create(orderObject).then(function () {
            return res.redirect('/?message=Your order has been successfully registered with OrderID: ' + orderId);
          }).catch(function (error1) {
            _logger2.default.error('error', 'An error occurred', error1);
            return res.redirect('/?message=An  error occurred, please try again');
          });
        });
      });
    }).catch(function (error) {
      _logger2.default.error('An error occurred', error);
      return res.redirect('/?message=An  error occurred, please try again');
    });
  },
  homepage: function homepage(req, res) {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    _logger2.default.error('private ip', ip, 'public ip', req.ip);
    var banks = ['Access Bank', 'Citibank', 'Diamond Bank', 'Ecobank Nigeria', 'Enterprise Bank Limited', 'Fidelity Bank Nigeria', 'First Bank of Nigeria', 'First City Monument Bank', 'FSDH Merchant Bank', 'Guaranty Trust Bank', 'Heritage Bank Plc.', 'Keystone Bank Limited', 'Mainstreet Bank Limited', 'Rand Merchant Bank', 'Savannah Bank', 'Skye Bank', 'Stanbic IBTC Bank Nigeria Limited', 'Standard Chartered Bank', 'Sterling Bank', 'Union Bank of Nigeria', 'United Bank for Africa', 'Unity Bank Plc.', 'Wema Bank', 'Zenith Bank'];
    var message = req.query.message || null;
    ProductPrice.findAll({
      where: {
        isActive: true
      }
    }).then(function (products) {
      return res.render('index', { products: products, banks: banks, message: message });
    }).catch(function (error) {
      _logger2.default.error('An error occurred', error);
      return (0, _utility.sendError)(res, { errorMessage: 'An  error occurred, please try again' });
    });
  }
};