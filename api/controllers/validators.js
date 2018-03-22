module.exports = {
  isValidEmail(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(email)) {
      return true;
    }
    return false;
  },
  isValidName(name, optional = false) {
    let regex = /^[a-zA-Z]{2,30}$/;
    if (optional) {
      regex = /^[a-zA-Z]{0,30}$/;
    }
    if (regex.test(name)) {
      return true;
    }
    return false;
  },
  isValidFullName(name) {
    const regex = /^(\s)?[a-zA-Z]{2,30}(\s[a-zA-Z]{2,30})?\s[a-zA-Z]{2,30}(\s)?$/;
    if (regex.test(name)) {
      return true;
    }
    return false;
  },
  isValidUserName(username) {
    const regex = /^[a-zA-Z0-9]{2,30}$/;
    if (regex.test(username)) {
      return true;
    }
    return false;
  },
  isValidPhoneNumber(Phonenumber) {
    const regex = /^[\+0-9]{2,30}$/;
    if (regex.test(Phonenumber)) {
      return true;
    }
    return false;
  },
  isValidatePassword(password) {
    const regex = /^[a-zA-Z0-9!@#$%^&*]{6,26}$/;
    if (regex.test(password)) {
      return true;
    }
    return false;
  },
  isValidAccountNumber(accountNumber) {
    const regex = /^([0-9]{10}|[0-9]{13})$/;
    if (regex.test(accountNumber)) {
      return true;
    }
    return false;
  },
  isValidateIdentity(username) {
    const regex = /^([a-zA-Z0-9]{2,30}|(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+)|([\+0-9]{2,30}))$/;
    if (regex.test(username)) {
      return true;
    }
    return false;
  },
  isOrderID(number) {
    const regex = /^([0-9]{4,5}-[0-9]{4,5}-[0-9]{4,5})$/;
    if (regex.test(number)) {
      return true;
    }
    return false;
  },
};
