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
          to: process.env.ADMIN_MAIL,
          subject: `Feedback for order ${orderId} from ${email}`,
          text: content,
        };
        const mailTransporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
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
};