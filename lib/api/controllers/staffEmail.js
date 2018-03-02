'use strict';

var _index = require('../db/models/index');

var _index2 = _interopRequireDefault(_index);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _utility = require('./utility');

var _validators = require('./validators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StaffEmail = _index2.default.staffemail;

/* eslint-disable no-unused-vars */
module.exports = {
  /* eslint-disable consistent-return  */
  getStaffEmails: function getStaffEmails(req, res) {
    StaffEmail.findAll({
      attributes: ['email']
    }).then(function (emails) {
      var emailList = [];
      emails.forEach(function (staff) {
        return emailList.push(staff.email);
      });
      return (0, _utility.sendResult)(res, { emails: emailList });
    }).catch(function (error) {
      _logger2.default.error('An error occurred', error);
      return (0, _utility.sendError)(res, { errorMessage: 'An  error occurred, please try again' });
    });
  },
  removeStaffEmails: function removeStaffEmails(req, res) {
    var email = req.params.email;
    if (!(0, _validators.isValidEmail)(email)) {
      return (0, _utility.sendError)(res, { errorMessage: 'The email is not valid' });
    }
    StaffEmail.findOne({
      where: { email: email },
      attributes: ['id']
    }).then(function (staffemail) {
      if (!staffemail) {
        return (0, _utility.sendError)(res, { errorMessage: 'email does not exist' });
      }
      staffemail.destroy().then(function (deleteEmail) {
        return (0, _utility.sendResult)(res, {
          message: 'Email has been removed successfully.',
          email: email
        });
      }).catch(function (error) {
        _logger2.default.error('error', 'An error occurred', error);
        return (0, _utility.sendError)(res, { errorMessage: 'An  error occurred, please try again' });
      });
    }).catch(function (error) {
      _logger2.default.error('error', 'An error occurred', error);
      return (0, _utility.sendError)(res, { errorMessage: 'An  error occurred, please try again' });
    });
  },
  addStaffEmails: function addStaffEmails(req, res) {
    var email = req.body.email;

    if (!(0, _validators.isValidEmail)(email)) {
      return (0, _utility.sendError)(res, { errorMessage: 'The email is not valid' });
    }
    StaffEmail.findOne({
      where: { email: email }
    }).then(function (staffemail) {
      if (!staffemail) {
        return StaffEmail.create({ email: email }).then(function (newEmail) {
          return (0, _utility.sendResult)(res, newEmail);
        }).catch(function (error) {
          _logger2.default.error('error', 'An error occurred', error);
          return (0, _utility.sendError)(res, { errorMessage: 'An  error occurred, please try again' });
        });
      }
      return (0, _utility.sendError)(res, { errorMessage: 'email already  exist' });
    }).catch(function (error) {
      _logger2.default.error('error', 'An error occurred', error);
      return (0, _utility.sendError)(res, { errorMessage: 'An  error occurred, please try again' });
    });
  }
};