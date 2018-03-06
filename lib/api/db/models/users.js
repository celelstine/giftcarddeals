'use strict';

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
  var users = sequelize.define('users', {
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: ['^[a-z]+$', 'i'],
          msg: 'last name should contain only  alphabets'
        },
        len: {
          arg: [2, 20],
          msg: 'last name should contain between 2 to 20 letters'
        }
      }
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: ['^[a-z]+$', 'i'],
          msg: 'first name should contain only alphabets'
        },
        len: {
          arg: [2, 20],
          msg: 'first name should contain between 2 to 20 letters'
        }
      }
    },
    othernames: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [10, 20],
          msg: 'password should contain between 10 to 20 characters'
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active'
    },
    user_category: {
      type: DataTypes.STRING,
      allowNull: true,
      default: 'customer'
    }
  }, {
    hooks: {
      /* eslint-disable no-param-reassign */
      beforeCreate: function beforeCreate(newuser) {
        newuser.password = _bcryptNodejs2.default.hashSync(newuser.password);
      },
      beforeUpdate: function beforeUpdate(newuser) {
        newuser.password = _bcryptNodejs2.default.hashSync(newuser.password);
      }
    }
  });

  users.associate = function (models) {
    // associations can be defined here
  };
  return users;
};