
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
    let giftcardsUrl = '';
    let randomFilename;
    if (incomingFiles.length) {
      incomingFiles.forEach((file) => {
        randomFilename = genereateOrderNumber() + file.name;
        file.mv(`${__dirname}/../../giftcards/${randomFilename}`,
          (err) => {
            if (err) {
              logger.error('An error occurred', err);
            }
          });
        // build the url for all files
        giftcardsUrl += `nngiftCards/${randomFilename}||`;
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
    const {
      acronym,
      bankName,
      bankAccountName,
      bankAccountNumber,
      email,
      extra,
      highDenominationRate,
      rate,
      ishighDenominationRate,
      productName,
      cardCurrency,
    } = req.body;
    const orderId = genereateOrderNumber(acronym);
    const orderObject = {
      bankName,
      bankAccountName,
      bankAccountNumber,
      email,
      extra,
      rate,
      highDenominationRate,
      productName,
      cardCurrency,
      orderId,
      subject: `New order from ${email}`,
      giftcardsUrl,
    };
    const mailTransporter = nodemailer.createTransport({
      host: 'mail.exchangezone9ja.com',
      port: 25,
      auth: {
        user: process.env.SEND_GIFTCARD_MAIL,
        pass: process.env.SEND_GIFTCARD_MAIL_PASSWORD,
      },
    });
    const text = `
      Card Details
      ---------------------------------
      Card type: ${productName}
      Rate: ${rate}
      High Denomination rate: ${highDenominationRate}

      Bank Details
      -----------------------------------
      Bank Name: ${bankName}
      Bank Account Number: ${bankAccountNumber}
      Bank Account Name: ${bankAccountName}

      Extra
      ------------------------------------
      ${extra}
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
          from: process.env.SEND_GIFTCARD_MAIL,
          to: process.env.ADMIN_MAIL,
          replyTo: process.env.SEND_GIFTCARD_MAIL,
          date: new Date(),
          bcc: emailList,
          subject: `order from ${email}, Order ID ${orderId}`,
          text,
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
            from: process.env.SEND_GIFTCARD_MAIL,
            to: email,
            replyTo: process.env.SEND_GIFTCARD_MAIL,
            date: new Date(),
            subject: `Your order has been recieved, Order ID ${orderId}`,
            text: `
              You order with order ID ${orderId} has been recieved.
              We would load the cards and transfer the money to your account.
              Our average response time is 10 times.
              Your can contact us via ${process.env.FEEDBACK_MAIL} or 08149677155
    
              thanks for choosing us.
    
              ${text}
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
                  You order with order ID <span style="text-decoration: underline;">
                  ${orderId}</span> has been recieved
                </h6>
                <div 
                  style="
                    text-align: justify;
                    text-justify: inter-word;
                  "
                >
                  <p>
                    We would load the cards and transfer the money to your account.
                      Our average response time is 10 minutes.
                  </p>
                  <h4 style="text-decoration: underline; margin: 0px"> Card Details </h4>
                  Card Type: ${productName} <br />
                  Rate: ${rate} <br />
                  High Denomination Rate: ${highDenominationRate} <br />

                  <h4 style="text-decoration: underline; margin: 0px"> Bank Details </h4>
                  Bank Name:  ${bankName} <br />
                  Bank Account Number:  ${bankAccountNumber} <br />
                  Bank Account Name: ${bankAccountName} <br />
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
            Order.create(orderObject)
              .then(() => {
                // send response to client
                const payload = {
                  orderId,
                  status: 'Pending',
                };
                return sendResult(res, payload);
              })
              .catch((error1) => {
                logger.error('error', 'An error occurred', error1);
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
  getOrders(req, res) {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const query = {};
    if (req.query.orderId) {
      query.orderId = req.query.orderId;
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
        'highDenominationRate',
        'productName',
        'cardCurrency',
        'email',
        'bankName',
        'bankAccountNumber',
        'bankAccountName',
        'createdAt',
        'giftcardsUrl',
      ],
    })
      .then((orders) => {
        if (orders.pageSize) {
          return sendError(res,
            { errorMessage: 'No record was found.' }
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