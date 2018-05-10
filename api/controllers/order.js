
import nodemailer from 'nodemailer';
import model from '../db/models/index';
import logger from '../logger';
import {
  sendResult,
  sendError,
} from './utility';
import { genereateOrderNumber } from './modelUtility';
import {
  isValidEmail,
  isValidAccountNumber,
  isValidFullName,
} from '../../api/controllers/validators';

const Order = model.order;
const StaffEmail = model.staffemail;
const ProductPrice = model.productPrice;

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
        // file.mv(`${__dirname}/../../giftcards/${randomFilename}`,
        //   (err) => {
        //     if (err) {
        //       logger.error('An error occurred', err);
        //     }
        //   });
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
      cardDenomination,
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
      Card Denomination: ${cardDenomination}

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
  placeOrder1(req, res) {
    // create object from request
    const {
      card,
      bankName,
      bankAccountName,
      bankAccountNumber,
      email,
      extra,
      cardDenomination,
    } = req.body;
    // validate inputs
    let inputValidationMessage = '';
    if (!isValidEmail(email)) {
      inputValidationMessage = '*Please provide a valid email \n';
    }
    if (!isValidAccountNumber(bankAccountNumber)) {
      inputValidationMessage += '*Please provide a valid Account Number (10 digits)\n';
    }
    if (!isValidFullName(bankAccountName)) {
      inputValidationMessage += '*Please provide a valid Account Name (at least two name)\n';
    }
    if (req.files['uploadedCards[]'].length > 10) {
      inputValidationMessage += '* You can only upload up to 10 images, combine the card if you have more than 10 images. \n';
    }
    const incomingFiles = req.files['uploadedCards[]'];
    let attachments = [];
    let giftcardsUrl = '';
    let randomFilename;
    if (inputValidationMessage) {
      return res.redirect(`/?message=${inputValidationMessage}`);
    }
    if (incomingFiles.length) {
      let fileSize = 0;
      incomingFiles.forEach((file) => {
        randomFilename = genereateOrderNumber() + file.name;
        // file.mv(`${__dirname}/../../giftcards/${randomFilename}`,
        //   (err) => {
        //     if (err) {
        //       logger.error('An error occurred', err);
        //     }
        //   });
        // build the url for all files
        giftcardsUrl += `nngiftCards/${randomFilename}||`;
        fileSize += file.data.length;
        // if the file size is more than 20mb
        if (fileSize > (1 * 1024 * 1024)) {
          inputValidationMessage += '* You can only upload up to 20mb, combine the card if you have more than 10 images.';
          return res.redirect(`/?message=${inputValidationMessage}`);
        }
        attachments.push({
          filename: file.name,
          content: new Buffer(file.data),
        });
      });
    } else {
      if (incomingFiles.data.length > (20 * 1024 * 1024)) {
        inputValidationMessage += '* You can only upload up to 20mb, combine the card if you have more than 10 images.';
        return res.redirect(`/?message=${inputValidationMessage}`);
      }
      attachments = { // binary buffer as an attachment
        filename: incomingFiles.name,
        content: new Buffer(incomingFiles.data),
      };
    }

    const orderId = genereateOrderNumber();
    const rateRecords = card.split('/');
    const rate = rateRecords[0];
    const highDenominationRate = rateRecords[1];
    const cardCurrency = '$';
    let productName = '';
    switch (rateRecords[2]) {
      case 'Australian':
      case 'Canadian':
      case 'USA':
        productName = `${rateRecords[2]} Itunes Card`;
        break;
      case 'Amazon':
      case 'Steam':
        productName = `${rateRecords[2]} Card`;
        break;
      default:
        break;
    }
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
      Rate: ₦${rate}/$
      High Denomination rate: ₦${highDenominationRate}/$
      Card Denomination: ${cardDenomination}

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
          return res.redirect('/?message=An  error occurred, please try again');
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
            return res.redirect('/?message=An  error occurred, please try again');
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
              return res.redirect('/?message=An  error occurred, please try again');
            }
            Order.create(orderObject)
              .then(() =>
                res.redirect(`/?message=Your order has been successfully registered with OrderID: ${orderId}`)
              )
              .catch((error1) => {
                logger.error('error', 'An error occurred', error1);
                return res.redirect('/?message=An  error occurred, please try again');
              });
          });
        });
      })
      .catch((error) => {
        logger.error('An error occurred', error);
        return res.redirect('/?message=An  error occurred, please try again');
      });
  },
  homepage(req, res) {
    const banks = [
      'Access Bank',
      'Citibank',
      'Diamond Bank',
      'Ecobank Nigeria',
      'Enterprise Bank Limited',
      'Fidelity Bank Nigeria',
      'First Bank of Nigeria',
      'First City Monument Bank',
      'FSDH Merchant Bank',
      'Guaranty Trust Bank',
      'Heritage Bank Plc.',
      'Keystone Bank Limited',
      'Mainstreet Bank Limited',
      'Rand Merchant Bank',
      'Savannah Bank',
      'Skye Bank',
      'Stanbic IBTC Bank Nigeria Limited',
      'Standard Chartered Bank',
      'Sterling Bank',
      'Union Bank of Nigeria',
      'United Bank for Africa',
      'Unity Bank Plc.',
      'Wema Bank',
      'Zenith Bank',
    ];
    const message = req.query.message || null;
    ProductPrice
      .findAll({
        where: {
          isActive: true,
        },
      })
      .then(products => res.render('index', { products, banks, message }))
      .catch((error) => {
        logger.error('An error occurred', error);
        return sendError(
          res,
          { errorMessage: 'An  error occurred, please try again' },
        );
      });
  },
};
