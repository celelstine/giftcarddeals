import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import Sequelize from 'sequelize';
import model from '../db/models/index';
import logger from '../logger';
import {
  isValidEmail,
  isValidName,
  isValidatePassword } from './validators';
import {
  sendResult,
  sendError,
  storeAuthToken,
} from './utility';

const Op = Sequelize.Op;
const User = model.users;
const AuthToken = model.authTokens;


module.exports = {
  /* eslint-disable consistent-return  */
  login(req, res) {
    // create object from request
    const {
      email,
      is3rdParty,
      password,
      rememberMe } = req.body;
    let errorMessage = '';

    if (!isValidEmail(email)) {
      errorMessage = 'Email must be provided';
      return sendError(res, { errorMessage }, 400);
    }

    if (is3rdParty === null && password === '') {
      errorMessage = 'Please provide a password for this account';
      return sendError(res, { errorMessage }, 400);
    }

    User
      .find({
        where: { email },
      })
      .then((foundUser) => {
        if (foundUser) {
          const userPassword = foundUser.password;
          // check if user is disabled
          if (foundUser.status === 'disabled') {
            errorMessage = 'This account is blocked, Please account admin';
            return sendError(res, { errorMessage }, 401);
          }
          // compare password
          const pass = bcrypt.compareSync(password, userPassword);
          if (pass) {
            // create middle name initial
            const middleNameInitial = (foundUser.othernames) ?
              `${foundUser.othernames.charAt(0)}.` : '';

            const userId = foundUser.id;
            const jwtToken = jwt.sign({ userId, email: foundUser.email },
              process.env.SECRET_KEY,
            );
            let rememberText = null;
            if (rememberMe) {
              rememberText = Math.random().toString(36);
              storeAuthToken(userId, rememberText);
            }
            // send response to client
            const payload = {
              userFullname: `${foundUser.firstname} ${middleNameInitial} ${foundUser.lastname}`,
              email: foundUser.email,
              jwtToken,
              rememberText,
              userCategory: foundUser.user_category,
            };
            return sendResult(res, payload);
          }
          errorMessage = 'Wrong email or password.';
          return sendError(res, { errorMessage }, 401);
        }
        errorMessage = 'Wrong email or password.';
        return sendError(res, { errorMessage }, 401);
      })
      .catch((err) => {
        logger.error('error', 'An error occurred', err);
        return sendError(res, { errorMessage: 'An  error occurred, please try again' });
      });
  },
  /**
   * - logout user
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - redirect
   */
  logout(req, res) {
    req.logout();
    res.redirect('/');
  },
  /**
   * create a user and return jwt and user name and email
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - jwt
   */
  signup(req, res) {
    let errorMessage = '';
    // extract user information  from request
    const {
      firstname,
      lastname,
      othernames,
      email,
      password,
      rememberMe,
    } = req.body;
    // check for required fields
    if (
      isValidName(firstname) &&
      isValidName(lastname) &&
      isValidName(othernames, true) &&
      isValidEmail(email) &&
      isValidatePassword(password)
    ) {
      // check if  user already exist
      return User.find({
        where: { email },
      })
        .then((foundUser) => {
          // if user exist exist return error
          if (foundUser) {
            // when account has been blocked
            switch (foundUser.status) {
              case 'disabled':
                errorMessage = 'This account is blocked, Please account admin';
                return sendError(res, { errorMessage }, 401);
              default:
                errorMessage = 'Email  already exist';
                return sendError(res, { errorMessage }, 409);
            }
          }

          // create a user object
          const userObject = {
            firstname,
            lastname,
            othernames,
            email,
            password,
          };
          return User.create(userObject)
            .then((newuser) => {
              const user = newuser.dataValues;
              const userId = user.id;
              const jwtToken = jwt.sign({ userId, email },
                process.env.SECRET_KEY,
              );
              let rememberText = null;
              if (rememberMe) {
                rememberText = Math.random().toString(36);
                storeAuthToken(userId, rememberText);
              }
              // send response to client
              const payload = {
                userFullname: `${firstname} ${othernames} ${lastname}`,
                email,
                jwtToken,
                rememberText,
                userCategory: user.user_category,
              };
              return sendResult(res, payload);
            })
            .catch((err) => {
              logger.error('error', 'An error occurred', err);
              return sendError(res, { errorMessage: 'An  error occurred, please try again' });
            });
        })
        .catch(() => sendError(
          res,
          { errorMessage: 'Invalid session, please login again.' },
          402),
        );
    }

    errorMessage = 'Firstname, lastname, email and password are compulsory.';
    return sendError(res, { errorMessage }, 400);
  },
  getUserwithRememberMeToken(req, res) {
    const { rememberText } = req.body;
    AuthToken.find({
      where: {
        selector: rememberText,
      },
      include: [
        { model: User, required: false },
      ],
    }).then((result) => {
      if (result) {
        const { user, hashedValidator } = result;
        const pass = bcrypt.compareSync(rememberText, hashedValidator);
        if (pass) {
          const {
            firstname,
            othernames,
            lastname,
            email,
            id,
          } = user;

          const newRememberText = Math.random().toString(36);
          storeAuthToken(id, newRememberText);
          const jwtToken = jwt.sign({ userId: id, email }, process.env.SECRET_KEY);
          const payload = {
            userFullname: `${firstname} ${othernames} ${lastname}`,
            email,
            jwtToken,
            rememberText: newRememberText,
            userCategory: user.user_category,
          };
          return sendResult(res, { payload });
        }
      }
      const errorMessage = 'Invalid session, Please login again.';
      return sendError(res, { errorMessage }, 401);
    }).catch((err) => {
      console.error('error', 'An error occurred', err);
      return sendError(res, { errorMessage: 'An  error occurred, please try again' });
    });
  },
};
