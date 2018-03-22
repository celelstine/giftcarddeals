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

var errorMessage = 'Sorry an error occurred, please try again';
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
        return (0, _utility.sendResult)(res, result.dataValues);
      });
    }).catch(function (error) {
      _logger2.default.error('error', 'An error occurred', error);
      return (0, _utility.sendError)(res, { error: error });
    });
  },
  SendAdminFeedback: function SendAdminFeedback(req, res) {
    var _req$body2 = req.body,
        orderId = _req$body2.orderId,
        email = _req$body2.email,
        feedbackCategory = _req$body2.feedbackCategory;

    var customText = '';
    var headerText = '';
    var extraText = req.body.extraText;

    if (!extraText) {
      extraText = '';
    }
    // create custom text
    switch (feedbackCategory) {
      case 'goodCard':
        customText = '\n        Hello, \n        Your card(s) was successfully redeemed and you will be credited shortly.\n        Thanks for choosing us.\n        ';
        headerText = 'Your card(s) was successfully redeemed';
        break;
      case 'usedCard':
        customText = '\n        Hello,\n        You uploaded an already used card(s). See screenshot for reference.\n        Thanks for choosing us.\n        ';
        headerText = 'You uploaded an already used card(s)';
        break;
      case 'nonActivatedCard':
        customText = '\n        Hello,\n        The card(s) you uploaded has not been activated.\n        See screenshot for reference.\n        Thanks for choosing us.\n        ';
        headerText = 'The card(s) you uploaded has not been activated';
        break;
      case 'blurryCard':
        customText = '\n        Hello,\n        The card(s) you uploaded are blurry. Kindly upload a clear card and a valid code.\n        Thanks for choosing us.\n        ';
        headerText = 'The card(s) you uploaded are blurry';
        break;
      case 'others':
        customText = '';
        headerText = 'Notification!!!';
        break;
      default:
        customText = '';
        headerText = 'Notification!!!';
        break;
    }

    var attachmentsList = [];
    if (req.files) {
      var attachments = req.files['attachments[]'];
      if (attachments.length) {
        attachments.forEach(function (file) {
          attachmentsList.push({
            filename: file.name,
            content: new Buffer(file.data)
          });
        });
      } else {
        attachmentsList = { // binary buffer as an attachment
          filename: attachments.name,
          content: new Buffer(attachments.data)
        };
      }
    }
    var mailTransporter = _nodemailer2.default.createTransport({
      host: 'mail.exchangezone9ja.com',
      port: 25,
      auth: {
        user: process.env.FEEDBACK_MAIL,
        pass: process.env.SEND_GIFTCARD_MAIL_PASSWORD
      }
    });
    // sending the email
    var mailPayload = {
      sender: process.env.FEEDBACK_MAIL,
      from: process.env.FEEDBACK_MAIL,
      to: email,
      replyTo: process.env.FEEDBACK_MAIL,
      date: new Date(),
      subject: 'Notification for Order ID ' + orderId,
      attachments: attachmentsList,
      text: '\n        ' + customText + '\n\n        ' + extraText + '\n        You can contact us via ' + process.env.FEEDBACK_MAIL + '\n        or ' + process.env.ADMIN_PHONE + '\n        whatsapp only \xBB ' + process.env.ADMIN_WHATSAPP_NUMBER + '\n        Thanks for choosing us.\n        ExchangeZone9ja \n        ' + new Date().toLocaleDateString('en-US') + '\n      ',
      html: '\n        <div\n          style="\n            font-family: Helvetica, sans-serif;\n            padding: 0.01em 16px;\n            max-width: 800px;\n            color: black\n            "\n        >\n          <h6\n            style="\n            color: #fff!important;\n            background-color: #ff5722!important;\n            font-size: larger;\n            padding: 5px 5px; \n            margin-bottom: 5px\n          ">\n            ' + headerText + '\n          </h6>\n          <div \n            style="\n              text-align: justify;\n              text-justify: inter-word;\n            "\n          >\n            <p>\n              ' + customText + '\n            </p>\n            <p>\n              ' + extraText + '\n            </p>\n            <p>\n              You can contact us via\n              <span style="text-decoration: underline;">\n              ' + process.env.FEEDBACK_MAIL + '\n              </span>\n              or ' + process.env.ADMIN_PHONE + '\n              whatsapp only \xBB ' + process.env.ADMIN_WHATSAPP_NUMBER + '\n            </p>\n            <p>Thanks for choosing us.<p>\n            <p>\n              ExchangeZone9ja <span style="float: right"> \n              ' + new Date().toLocaleDateString('en-US') + '\n              </span>\n            </p>\n          </div>\n        </div>\n      '
    };
    mailTransporter.sendMail(mailPayload, function (err, info1) {
      if (err) {
        _logger2.default.error('error', 'An error occurred', err);
        return (0, _utility.sendError)(res, { errorMessage: errorMessage });
      }
      return (0, _utility.sendResult)(res, {
        message: 'Feedback has been sent'
      });
    });
  }
};