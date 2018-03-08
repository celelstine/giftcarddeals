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
        from: process.env.FEEDBACK_MAIL,
        to: process.env.ADMIN_MAIL,
        replyTo: process.env.FEEDBACK_MAIL,
        date: new Date(),
        subject: 'Feedback for order ' + orderId + ' from ' + email,
        text: content,
        html: '\n            <div\n                style="\n                  font-family: Helvetica, sans-serif;\n                  padding: 0.01em 16px;\n                  max-width: 800px;\n                  color: black\n                "\n            >\n              <h6\n                style="\n                  color: #fff!important;\n                  background-color: #ff5722!important;\n                  font-size: larger;\n                  padding: 5px 5px; \n                  margin-bottom: 5px\n                "\n              >\n                  Feedback for order ' + orderId + ' from \n                  <i>' + email + '</i>\n              </h6>\n              <div \n                style="\n                  text-align: justify;\n                  text-justify: inter-word;\n                  padding: 0.01em 16px;\n                "\n              >\n                ' + content + '\n              </div>\n            </div>         \n          '
      };
      var mailTransporter = _nodemailer2.default.createTransport({
        host: 'mail.exchangezone9ja.com',
        port: 25,
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
        console.log('----->', info);
        return (0, _utility.sendResult)(res, result.dataValues);
      });
    }).catch(function (error) {
      _logger2.default.error('error', 'An error occurred', error);
      return (0, _utility.sendError)(res, { error: error });
    });
  }
};