import nodemailer from 'nodemailer';
import model from '../db/models/index';
import logger from '../logger';
import {
  sendResult,
  sendError,
} from './utility';

const FeedBack = model.feedback;

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
              <header
                style="
                  color: #fff!important;
                  background-color: #ff5722!important;
                "
              >
                <h6>
                  Feedback for order ${orderId} from 
                  <i>${email}</i>
                </h6>
              </header>
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
          console.log('----->', info);
          return sendResult(res, result.dataValues);
        });
      })
      .catch((error) => {
        logger.error('error', 'An error occurred', error);
        return sendError(res, { error });
      });
  },
};
