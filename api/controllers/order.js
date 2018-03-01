
import nodemailer from 'nodemailer';
import model from '../db/models/index';
import logger from '../logger';
import {
  sendResult,
  sendError,
} from './utility';
import { genereateOrderNumber } from './modelUtility';

const Order = model.order;
const StaffEmail = model.staffemail;

const errorMessage = 'Sorry an error occurred, please try again';

/* eslint-disable no-unused-vars */
module.exports = {
  /* eslint-disable consistent-return  */
  placeOrder(req, res) {
    // create object from request
    const incomingFiles = req.files['uploadedCards[]'];
    let attachments = [];
    if (incomingFiles.length) {
      incomingFiles.forEach((file) => {
        attachments.push({
          filename: file.name,
          content: new Buffer(file.data),
        });
      });
    } else {
      attachments = { // binary buffer as an attachment
        filename: incomingFiles.name,
        content: new Buffer(incomingFiles.data),
      };
    }
    const orderId = genereateOrderNumber();
    const {
      bankName,
      bankAccountName,
      bankAccountNumber,
      email,
      extra,
      rate,
      productName,
      cardCurrency,
    } = req.body;
    const orderObject = {
      bankName,
      bankAccountName,
      bankAccountNumber,
      email,
      extra,
      rate,
      productName,
      cardCurrency,
      orderId,
      subject: `New order from ${email}`,
    };
    const mailTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: process.env.SEND_GIFTCARD_MAIL,
        pass: process.env.SEND_GIFTCARD_MAIL_PASSWORD,
      },
    });
    const text = `
      Card Details
      ---------------------------------
      card type: ${productName}
      rate: ${rate}

      Bank Details
      -----------------------------------
      Bank Name: ${bankName}
      Bank Account Number: ${bankAccountNumber}
      Bank Account Name: ${bankAccountName}
    `;
    StaffEmail
      .findAll({
        attributes: ['email'],
      })
      .then((emails) => {
        if (!emails.length) {
          logger.error('error', 'The staff Email table is empty');
          return sendError(res, { errorMessage });
        }
        const emailList = [];
        emails.forEach(staff => emailList.push(staff.email));
        let mailPayload = {
          sender: process.env.SEND_GIFTCARD_MAIL,
          to: process.env.ADMIN_MAIL,
          subject: `order from ${email}, Order ID ${orderId}`,
          text,
          bcc: emailList,
          attachments,
        };
        mailTransporter.sendMail(mailPayload, (error, info) => {
          if (error) {
            logger.error('error', 'An error occurred', error);
            return sendError(res, { errorMessage });
          }
          // send mail to user email
          mailPayload = {
            sender: process.env.SEND_GIFTCARD_MAIL,
            to: email,
            subject: `Your order has been recieved, Order ID ${orderId}`,
            text: `
              You order with order ID ${orderId} has been recieved.
              We would load the cards and transfer the money to your account.
              Our average response time is 10 times.
              Your can contact us via ${process.env.FEEDBACK_MAIL} or 08149677155
    
              thanks for choosing us.
    
              ${text}
            `,
          };
          mailTransporter.sendMail(mailPayload, (err, info) => {
            if (err) {
              logger.error('error', 'An error occurred', err);
              return sendError(res, { errorMessage });
            }
    
            Order.create(orderObject)
              .then(() => {
                // send response to client
                const payload = {
                  orderId,
                  status: 'Pending',
                };
                return sendResult(res, payload);
              })
              .catch((err) => {
                logger.error('error', 'An error occurred', err);
                return sendError(res, { errorMessage });
              });
          });
        });
      })
      .catch((error) => {
        logger.error('An error occurred', error);
        return sendError(
          res,
          { errorMessage: 'An  error occurred, please try again' },
        );
      });
  },
  getClientOrders(req, res) {
    Order.findAll({
      where: {
        clientId: req.user.userId,
      },
      attributes: [
        'id',
        'status',
        'orderId',
        'rate',
        'productName',
        'cardCurrency',
        'email',
        'bankName',
        'bankAccountNumber',
        'bankAccountName',
        'createdAt',
      ],
    })
      .then(orders => sendResult(res, orders))
      .catch((error) => {
        logger.error('error', 'An error occurred', error);
        return sendError(res, { errorMessage });
      });
  },
  getOrders(req, res) {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const query = {};
    if (req.query.orderId) {
      query.orderId = req.query.orderId;
    }
    if (req.user.user_category !== 'admin') {
      query.clientId = req.user.userId;
    }

    Order.findAndCountAll({
      where: { ...query },
      offset,
      limit,
      order: [['id', 'DESC']],
      attributes: [
        'id',
        'status',
        'orderId',
        'rate',
        'productName',
        'cardCurrency',
        'email',
        'bankName',
        'bankAccountNumber',
        'bankAccountName',
        'createdAt',
      ],
    })
      .then((orders) => {
        if (orders.pageSize) {
          return sendError(res,
            { errorMessage: 'No document was found.' }
            , 409);
        }
        const count = orders.count;
        const rows = orders.rows;
        let pageCount = parseInt(count / limit, 10);
        if (pageCount < (count / limit)) { pageCount += 1; }
        const ordersPayload = {
          count,
          orders: rows,
          curPage: parseInt(offset / limit, 10) + 1,
          pageCount,
          pageSize: rows.length,
        };
        return sendResult(res, ordersPayload);
      })
      .catch((error) => {
        logger.error('error', 'An error occurred', error);
        return sendError(res, { errorMessage });
      });
  },
};
