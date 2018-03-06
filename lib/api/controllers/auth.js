'use strict';

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _index = require('../db/models/index');

var _index2 = _interopRequireDefault(_index);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _validators = require('./validators');

var _utility = require('./utility');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Op = _sequelize2.default.Op;
var User = _index2.default.users;
var AuthToken = _index2.default.authTokens;

module.exports = {
  /* eslint-disable consistent-return  */
  login: function login(req, res) {
    // create object from request
    var _req$body = req.body,
        email = _req$body.email,
        is3rdParty = _req$body.is3rdParty,
        password = _req$body.password,
        rememberMe = _req$body.rememberMe;

    var errorMessage = '';

    if (!(0, _validators.isValidEmail)(email)) {
      errorMessage = 'Email must be provided';
      return (0, _utility.sendError)(res, { errorMessage: errorMessage }, 400);
    }

    if (is3rdParty === null && password === '') {
      errorMessage = 'Please provide a password for this account';
      return (0, _utility.sendError)(res, { errorMessage: errorMessage }, 400);
    }

    User.find({
      where: { email: email }
    }).then(function (foundUser) {
      if (foundUser) {
        var userPassword = foundUser.password;
        // check if user is disabled
        if (foundUser.status === 'disabled') {
          errorMessage = 'This account is blocked, Please account admin';
          return (0, _utility.sendError)(res, { errorMessage: errorMessage }, 401);
        }
        // compare password
        var pass = _bcryptNodejs2.default.compareSync(password, userPassword);
        if (pass) {
          // create middle name initial
          var middleNameInitial = foundUser.othernames ? foundUser.othernames.charAt(0) + '.' : '';

          var userId = foundUser.id;
          var jwtToken = _jsonwebtoken2.default.sign({ userId: userId, email: foundUser.email }, process.env.SECRET_KEY);
          var rememberText = null;
          if (rememberMe) {
            rememberText = Math.random().toString(36);
            (0, _utility.storeAuthToken)(userId, rememberText);
          }
          // send response to client
          var payload = {
            userFullname: foundUser.firstname + ' ' + middleNameInitial + ' ' + foundUser.lastname,
            email: foundUser.email,
            jwtToken: jwtToken,
            rememberText: rememberText,
            userCategory: foundUser.user_category
          };
          return (0, _utility.sendResult)(res, payload);
        }
        errorMessage = 'Wrong email or password.';
        return (0, _utility.sendError)(res, { errorMessage: errorMessage }, 401);
      }
      errorMessage = 'Wrong email or password.';
      return (0, _utility.sendError)(res, { errorMessage: errorMessage }, 401);
    }).catch(function (err) {
      _logger2.default.error('error', 'An error occurred', err);
      return (0, _utility.sendError)(res, { errorMessage: 'An  error occurred, please try again' });
    });
  },

  /**
   * - logout user
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - redirect
   */
  logout: function logout(req, res) {
    req.logout();
    res.redirect('/');
  },

  /**
   * create a user and return jwt and user name and email
   * @param {*} req - client request
   * @param {*} res - server response
   * @return {object} - jwt
   */
  signup: function signup(req, res) {
    var errorMessage = '';
    // extract user information  from request
    var _req$body2 = req.body,
        firstname = _req$body2.firstname,
        lastname = _req$body2.lastname,
        othernames = _req$body2.othernames,
        email = _req$body2.email,
        password = _req$body2.password,
        rememberMe = _req$body2.rememberMe;
    // check for required fields

    if ((0, _validators.isValidName)(firstname) && (0, _validators.isValidName)(lastname) && (0, _validators.isValidName)(othernames, true) && (0, _validators.isValidEmail)(email) && (0, _validators.isValidatePassword)(password)) {
      // check if  user already exist
      return User.find({
        where: { email: email }
      }).then(function (foundUser) {
        // if user exist exist return error
        if (foundUser) {
          // when account has been blocked
          switch (foundUser.status) {
            case 'disabled':
              errorMessage = 'This account is blocked, Please account admin';
              return (0, _utility.sendError)(res, { errorMessage: errorMessage }, 401);
            default:
              errorMessage = 'Email  already exist';
              return (0, _utility.sendError)(res, { errorMessage: errorMessage }, 409);
          }
        }

        // create a user object
        var userObject = {
          firstname: firstname,
          lastname: lastname,
          othernames: othernames,
          email: email,
          password: password
        };
        return User.create(userObject).then(function (newuser) {
          var user = newuser.dataValues;
          var userId = user.id;
          var jwtToken = _jsonwebtoken2.default.sign({ userId: userId, email: email }, process.env.SECRET_KEY);
          var rememberText = null;
          if (rememberMe) {
            rememberText = Math.random().toString(36);
            (0, _utility.storeAuthToken)(userId, rememberText);
          }
          // send response to client
          var payload = {
            userFullname: firstname + ' ' + othernames + ' ' + lastname,
            email: email,
            jwtToken: jwtToken,
            rememberText: rememberText,
            userCategory: user.user_category
          };
          return (0, _utility.sendResult)(res, payload);
        }).catch(function (err) {
          _logger2.default.error('error', 'An error occurred', err);
          return (0, _utility.sendError)(res, { errorMessage: 'An  error occurred, please try again' });
        });
      }).catch(function () {
        return (0, _utility.sendError)(res, { errorMessage: 'Invalid session, please login again.' }, 402);
      });
    }

    errorMessage = 'Firstname, lastname, email and password are compulsory.';
    return (0, _utility.sendError)(res, { errorMessage: errorMessage }, 400);
  },
  getUserwithRememberMeToken: function getUserwithRememberMeToken(req, res) {
    var rememberText = req.body.rememberText;

    AuthToken.find({
      where: {
        selector: rememberText
      },
      include: [{ model: User, required: false }]
    }).then(function (result) {
      if (result) {
        var user = result.user,
            hashedValidator = result.hashedValidator;

        var pass = _bcryptNodejs2.default.compareSync(rememberText, hashedValidator);
        if (pass) {
          var firstname = user.firstname,
              othernames = user.othernames,
              lastname = user.lastname,
              email = user.email,
              id = user.id;


          var newRememberText = Math.random().toString(36);
          (0, _utility.storeAuthToken)(id, newRememberText);
          var jwtToken = _jsonwebtoken2.default.sign({ userId: id, email: email }, process.env.SECRET_KEY);
          var payload = {
            userFullname: firstname + ' ' + othernames + ' ' + lastname,
            email: email,
            jwtToken: jwtToken,
            rememberText: newRememberText,
            userCategory: user.user_category
          };
          return (0, _utility.sendResult)(res, { payload: payload });
        }
      }
      var errorMessage = 'Invalid session, Please login again.';
      return (0, _utility.sendError)(res, { errorMessage: errorMessage }, 401);
    }).catch(function (err) {
      _logger2.default.error('error', 'An error occurred', err);
      return (0, _utility.sendError)(res, { errorMessage: 'An  error occurred, please try again' });
    });
  }
};