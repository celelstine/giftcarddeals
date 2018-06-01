'use strict';

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _index = require('../db/models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = _index2.default.users;
var AuthToken = _index2.default.authTokens;

module.exports = {
  // helper functions
  sendResult: function sendResult(res, result) {
    return res.status(200).json(result);
  },
  sendError: function sendError(res, errorMessage) {
    var responseCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

    return res.status(responseCode).json(errorMessage);
  },

  /**
   * validate user using jwt
   * @param {*} req - client request
   * @param {*} res - server response
   * @param {*} next - call the next route
   * @returns {object} -
   */
  adminPass: function adminPass(req, res, next) {
    if (!req.headers && !req.body && !req.query) {
      // if there is no data to process
      return res.status(401).send({
        message: 'Session has expired, please signin'
      });
    }
    var token = req.headers.authorization || req.body.token || req.query.token;
    // decoding the token
    if (token) {
      _jsonwebtoken2.default.verify(token, process.env.SECRET_KEY, function (error, decoded) {
        if (error) {
          return res.status(401).send({
            message: 'Failed to authenticate token.'
          });
        }
        // check if user is disable
        User.find({
          where: {
            id: decoded.userId
          }
        }).then(function (foundUser) {
          if (foundUser) {
            // react to user status
            var accountStatus = foundUser.status;
            switch (accountStatus) {
              case 'disabled':
                return res.status(401).send({
                  message: 'This account is blocked, Please contact the admin'
                });
              case 'inactive':
                return res.status(401).send({
                  message: 'This account does not exist'
                });
              case 'active':
                // attach user info to the request object
                /* eslint-disable no-param-reassign */
                if (foundUser.user_category !== 'admin') {
                  return res.status(401).send({
                    message: 'Wrong authentication credentials, ' + 'please signin/signup again'
                  });
                }
                req.user = decoded;
                return next();
              default:
                return res.status(401).send({
                  message: 'Invalid operation, check your credentials'
                });
            }
          }
          return res.status(401).send({
            message: 'Wrong authentication credentials, ' + 'please signin/signup again'
          });
        }).catch(function (err) {
          return res.status(500).send({
            message: 'Error occurred, please try again: ' + err.message
          });
        });
      });
    } else {
      // if there is no token available return a message
      res.status(401).send({ message: 'No token provided.' });
    }
  },
  storeAuthToken: function storeAuthToken(userId, selector) {
    var today = new Date();
    var expires = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    var newAuthTokenObj = {
      selector: selector,
      userId: userId,
      hashedValidator: 'placeholder',
      expires: expires
    };

    // delete existing token
    AuthToken.destroy({
      where: {
        userId: userId
      }
    }).then(function () {
      AuthToken.create(newAuthTokenObj).then(function () {
        return selector;
      }).catch(function (err) {
        logger.error('An error occurred', err);
        return null;
      });
    }).catch(function () {
      return null;
    });
  }
};