
import formidable from 'formidable';
import nodemailer from 'nodemailer';
import model from '../db/models/index';
// import console from '../console';
import {
  sendResult,
  sendError,
} from './utility';
import { genereateOrderNumber } from './modelUtility';

const Order = model.order;
const errorMessage = 'Sorry an error occurred, please try again';

/* eslint-disable no-unused-vars */
module.exports = {
  /* eslint-disable consistent-return  */
  placeOrder(req, res) {
    // create object from request
    const form = new formidable.IncomingForm();
    let orderDetails;
    let orderObject;
    const orderId = genereateOrderNumber();
    form.parse(req, (err, fields, files) => {
      orderDetails = { ...fields };
      console.log('fields', fields);
      orderObject = {
        ...fields,
        clientId: req.user.userId,
        orderId,
        subject: `New order from ${fields.email}`,
      };
    });
    const filesPaths = [];
    /* eslint-disable no-param-reassign */
    form.on('fileBegin', (name, file) => {
      file.path = `${__dirname}/giftcards/${Date.now().toString()}${file.name}`;
      filesPaths.push({ path: file.path, filename: file.name });
    });

    form.on('error', (err) => {
      console.error('An error occurred', err);
      return sendError(res, { errorMessage: `${err.message || err}` });
    });
    // send mail when every file has been inserted
    form.on('end', () => {
      const mailTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SEND_GIFTCARD_MAIL,
          pass: process.env.SEND_GIFTCARD_MAIL_PASSWORD,
        },
      });
      const text = `
        Card Details
        ---------------------------------
        card type: ${orderDetails.productName}
        rate: ${orderDetails.rate}
        Bank Details
        -----------------------------------
        Bank Name: ${orderDetails.bankName}
        Bank Account Number: ${orderDetails.bankAccountNumber}
        Bank Account Name: ${orderDetails.bankAccountName}
      `;
      let mailPayload = {
        sender: process.env.SEND_GIFTCARD_MAIL,
        to: process.env.ADMIN_MAIL,
        subject: `order from ${orderDetails.email}, Order ID ${orderId}`,
        text,
        bcc: ['okorocelestine@gmail.com', process.env.FEEDBACK_MAIL],
        attachments: filesPaths,
      };
      mailTransporter.sendMail(mailPayload, (error, info) => {
        if (error) {
          console.error('An error occurred', error);
          return sendError(res, { errorMessage });
        }
        // send mail to user orderDetails.email
        mailPayload = {
          sender: process.env.SEND_GIFTCARD_MAIL,
          to: orderDetails.email,
          subject: `Your order has been recieved, Order ID ${orderId}`,
          text: `
            You order with order ID ${orderId} has been recieved.
            We would load the cards and transfer the money to your account.
            Our average response time is 10 times.
            Your can contact us via okorocelestine@gmail.com or 08066112787

            thanks for choosing us.

            ${text}
          `,
        };
        mailTransporter.sendMail(mailPayload, (err, info) => {
          if (err) {
            console.error('An error occurred', err);
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
              console.error('An error occurred', err);
              return sendError(res, { errorMessage });
            });
        });
      });
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
        console.error('An error occurred', error);
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
        console.error('An error occurred', error);
        return sendError(res, { errorMessage });
      });
  },
};
