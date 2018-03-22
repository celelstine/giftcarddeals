"use strict";

module.exports = {
  isValidEmail: function isValidEmail(email) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(email)) {
      return true;
    }
    return false;
  },
  isValidName: function isValidName(name) {
    var optional = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var regex = /^[a-zA-Z]{2,30}$/;
    if (optional) {
      regex = /^[a-zA-Z]{0,30}$/;
    }
    if (regex.test(name)) {
      return true;
    }
    return false;
  },
  isValidFullName: function isValidFullName(name) {
    var regex = /^(\s)?[a-zA-Z]{2,30}(\s[a-zA-Z]{2,30})?\s[a-zA-Z]{2,30}(\s)?$/;
    if (regex.test(name)) {
      return true;
    }
    return false;
  },
  isValidUserName: function isValidUserName(username) {
    var regex = /^[a-zA-Z0-9]{2,30}$/;
    if (regex.test(username)) {
      return true;
    }
    return false;
  },
  isValidPhoneNumber: function isValidPhoneNumber(Phonenumber) {
    var regex = /^[\+0-9]{2,30}$/;
    if (regex.test(Phonenumber)) {
      return true;
    }
    return false;
  },
  isValidatePassword: function isValidatePassword(password) {
    var regex = /^[a-zA-Z0-9!@#$%^&*]{6,26}$/;
    if (regex.test(password)) {
      return true;
    }
    return false;
  },
  isValidAccountNumber: function isValidAccountNumber(accountNumber) {
    var regex = /^([0-9]{10}|[0-9]{13})$/;
    if (regex.test(accountNumber)) {
      return true;
    }
    return false;
  },
  isValidateIdentity: function isValidateIdentity(username) {
    var regex = /^([a-zA-Z0-9]{2,30}|(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+)|([\+0-9]{2,30}))$/;
    if (regex.test(username)) {
      return true;
    }
    return false;
  },
  isOrderID: function isOrderID(number) {
    var regex = /^([0-9]{4,5}-[0-9]{4,5}-[0-9]{4,5})$/;
    if (regex.test(number)) {
      return true;
    }
    return false;
  }
};