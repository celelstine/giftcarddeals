import nodemailer from 'nodemailer';
import model from '../db/models/index';
import logger from '../logger';
import {
  sendResult,
  sendError,
} from './utility';

const FeedBack = model.feedback;

const errorMessage = 'Sorry an error occurred, please try again';
/* eslint-disable no-unused-vars */
module.exports = {
  /* eslint-disable consistent-return  */
  sendFeedback(req, res) {
    // create object from request
    const {
      content,
      orderId,
      email,
    } = req.body;
    const FeedbackDetails = {
      content,
      orderId,
      email,
    };
    FeedBack.create(FeedbackDetails)
      .then((result) => {
        const mailPayload = {
          sender: process.env.FEEDBACK_MAIL,
          from: process.env.FEEDBACK_MAIL,
          to: process.env.ADMIN_MAIL,
          replyTo: process.env.FEEDBACK_MAIL,
          date: new Date(),
          subject: `Feedback for order ${orderId} from ${email}`,
          text: content,
          html: `
            <div
                style="
                  font-family: Helvetica, sans-serif;
                  padding: 0.01em 16px;
                  max-width: 800px;
                  color: black
                "
            >
              <h6
                style="
                  color: #fff!important;
                  background-color: #ff5722!important;
                  font-size: larger;
                  padding: 5px 5px; 
                  margin-bottom: 5px
                "
              >
                  Feedback for order ${orderId} from 
                  <i>${email}</i>
              </h6>
              <div 
                style="
                  text-align: justify;
                  text-justify: inter-word;
                  padding: 0.01em 16px;
                "
              >
                ${content}
              </div>
            </div>         
          `,
        };
        const mailTransporter = nodemailer.createTransport({
          host: 'mail.exchangezone9ja.com',
          port: 25,
          auth: {
            user: process.env.FEEDBACK_MAIL,
            pass: process.env.SEND_GIFTCARD_MAIL_PASSWORD,
          },
        });
        mailTransporter.sendMail(mailPayload, (err, info) => {
          if (err) {
            logger.error('error', 'An error occurred', err);
            return sendError(res, { err });
          }
          return sendResult(res, result.dataValues);
        });
      })
      .catch((error) => {
        logger.error('error', 'An error occurred', error);
        return sendError(res, { error });
      });
  },
  SendAdminFeedback(req, res) {
    const {
      orderId,
      email,
      feedbackCategory,
    } = req.body;
    let customText = '';
    let headerText = '';
    let { extraText } = req.body;
    if (!extraText) {
      extraText = '';
    }
    // create custom text
    switch (feedbackCategory) {
      case 'goodCard':
        customText = `
        Hello, 
        Your card(s) was successfully redeemed and you will be credited shortly.
        Thanks for choosing us.
        `;
        headerText = 'Your card(s) was successfully redeemed';
        break;
      case 'usedCard':
        customText = `
        Hello,
        You uploaded an already used card(s). See screenshot for reference.
        Thanks for choosing us.
        `;
        headerText = 'You uploaded an already used card(s)';
        break;
      case 'nonActivatedCard':
        customText = `
        Hello,
        The card(s) you uploaded has not been activated.
        See screenshot for reference.
        Thanks for choosing us.
        `;
        headerText = 'The card(s) you uploaded has not been activated';
        break;
      case 'blurryCard':
        customText = `
        Hello,
        The card(s) you uploaded are blurry. Kindly upload a clear card and a valid code.
        Thanks for choosing us.
        `;
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

    let attachmentsList = [];
    if (req.files) {
      const attachments = req.files['attachments[]'];
      if (attachments.length) {
        attachments.forEach((file) => {
          attachmentsList.push({
            filename: file.name,
            content: new Buffer(file.data),
          });
        });
      } else {
        attachmentsList = { // binary buffer as an attachment
          filename: attachments.name,
          content: new Buffer(attachments.data),
        };
      }
    }
    const mailTransporter = nodemailer.createTransport({
      host: 'mail.exchangezone9ja.com',
      port: 25,
      auth: {
        user: process.env.FEEDBACK_MAIL,
        pass: process.env.SEND_GIFTCARD_MAIL_PASSWORD,
      },
    });
    // sending the email
    const mailPayload = {
      sender: process.env.FEEDBACK_MAIL,
      from: process.env.FEEDBACK_MAIL,
      to: email,
      replyTo: process.env.FEEDBACK_MAIL,
      date: new Date(),
      subject: `Notification for Order ID ${orderId}`,
      attachments: attachmentsList,
      text: `
        ${customText}

        ${extraText}
        You can contact us via ${process.env.FEEDBACK_MAIL}
        or ${process.env.ADMIN_PHONE}
        whatsapp only » ${process.env.ADMIN_WHATSAPP_NUMBER}
        Thanks for choosing us.
        ExchangeZone9ja 
        ${new Date().toLocaleDateString('en-US')}
      `,
      html: `
        <div
          style="
            font-family: Helvetica, sans-serif;
            padding: 0.01em 16px;
            max-width: 800px;
            color: black
            "
        >
          <h6
            style="
            color: #fff!important;
            background-color: #ff5722!important;
            font-size: larger;
            padding: 5px 5px; 
            margin-bottom: 5px
          ">
            ${headerText}
          </h6>
          <div 
            style="
              text-align: justify;
              text-justify: inter-word;
            "
          >
            <p>
              ${customText}
            </p>
            <p>
              ${extraText}
            </p>
            <p>
              You can contact us via
              <span style="text-decoration: underline;">
              ${process.env.FEEDBACK_MAIL}
              </span>
              or ${process.env.ADMIN_PHONE}
              whatsapp only » ${process.env.ADMIN_WHATSAPP_NUMBER}
            </p>
            <p>Thanks for choosing us.<p>
            <p>
              ExchangeZone9ja <span style="float: right"> 
              ${new Date().toLocaleDateString('en-US')}
              </span>
            </p>
          </div>
        </div>
      `,
    };
    mailTransporter.sendMail(mailPayload, (err, info1) => {
      if (err) {
        logger.error('error', 'An error occurred', err);
        return sendError(res, { errorMessage });
      }
      return sendResult(res, {
        message: 'Feedback has been sent',
      });
    });
  },
};
