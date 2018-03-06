'use strict';

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _index = require('../db/models/index');

var _index2 = _interopRequireDefault(_index);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _utility = require('./utility');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FeedBack = _index2.default.feedback;

/* eslint-disable no-unused-vars */
module.exports = {
  /* eslint-disable consistent-return  */
  sendFeedback: function sendFeedback(req, res) {
    // create object from request
    var _req$body = req.body,
        content = _req$body.content,
        orderId = _req$body.orderId,
        email = _req$body.email;

    var FeedbackDetails = {
      content: content,
      orderId: orderId,
      email: email
    };
    FeedBack.create(FeedbackDetails).then(function (result) {
      var mailPayload = {
        sender: process.env.FEEDBACK_MAIL,
        to: process.env.ADMIN_MAIL,
        subject: 'Feedback for order ' + orderId + ' from ' + email,
        text: content
      };
      var mailTransporter = _nodemailer2.default.createTransport({
        host: 'mail.exchangezone9ja.com',
        port: 25,
        secure: true,
        auth: {
          user: process.env.FEEDBACK_MAIL,
          pass: process.env.SEND_GIFTCARD_MAIL_PASSWORD
        }
      });
      mailTransporter.sendMail(mailPayload, function (err, info) {
        if (err) {
          _logger2.default.error('error', 'An error occurred', err);
          return (0, _utility.sendError)(res, { err: err });
        }
        return (0, _utility.sendResult)(res, result.dataValues);
      });
    }).catch(function (error) {
      _logger2.default.error('error', 'An error occurred', error);
      return (0, _utility.sendError)(res, { error: error });
    });
  }
};