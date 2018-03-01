import model from '../db/models/index';
import logger from '../logger';
import {
  sendResult,
  sendError,
} from './utility';
import { isValidEmail } from './validators';

const StaffEmail = model.staffemail;

/* eslint-disable no-unused-vars */
module.exports = {
  /* eslint-disable consistent-return  */
  getStaffEmails(req, res) {
    StaffEmail
      .findAll({
        attributes: ['email'],
      })
      .then((emails) => {
        const emailList = [];
        emails.forEach(staff => emailList.push(staff.email));
        return sendResult(res, { emails: emailList });
      })
      .catch((error) => {
        logger.error('An error occurred', error);
        return sendError(
          res,
          { errorMessage: 'An  error occurred, please try again' },
        );
      });
  },
  removeStaffEmails(req, res) {
    const email = req.params.email;
    if (!isValidEmail(email)) {
      return sendError(
        res,
        { errorMessage: 'The email is not valid' },
      );
    }
    StaffEmail
      .findOne({
        where: { email },
        attributes: ['id'],
      })
      .then((staffemail) => {
        if (!staffemail) {
          return sendError(res, { errorMessage: 'email does not exist' });
        }
        staffemail
          .destroy()
          .then((deleteEmail) => {
            return sendResult(res, {
              message: 'Email has been removed successfully.',
              email,
            });
          })
          .catch((error) => {
            logger.error('error', 'An error occurred', error);
            return sendError(
              res,
              { errorMessage: 'An  error occurred, please try again' },
            );
          });
      })
      .catch((error) => {
        logger.error('error', 'An error occurred', error);
        return sendError(
          res,
          { errorMessage: 'An  error occurred, please try again' },
        );
      });
  },
  addStaffEmails(req, res) {
    const { email } = req.body;
    if (!isValidEmail(email)) {
      return sendError(
        res,
        { errorMessage: 'The email is not valid' },
      );
    }
    StaffEmail
      .findOne({
        where: { email },
      })
      .then((staffemail) => {
        if (!staffemail) {
          return StaffEmail
            .create({ email })
            .then(newEmail => sendResult(res, newEmail ))
            .catch((error) => {
              logger.error('error', 'An error occurred', error);
              return sendError(
                res,
                { errorMessage: 'An  error occurred, please try again' },
              );
            });
        }
        return sendError(res, { errorMessage: 'email already  exist' });
      })
      .catch((error) => {
        logger.error('error', 'An error occurred', error);
        return sendError(
          res,
          { errorMessage: 'An  error occurred, please try again' },
        );
      });
  },
};
