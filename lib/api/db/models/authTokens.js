'use strict';

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
  var authTokens = sequelize.define('authTokens', {
    selector: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hashedValidator: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      default: 'active'
    }
  }, {
    hooks: {
      /* eslint-disable no-param-reassign */
      beforeCreate: function beforeCreate(newAuthToken) {
        newAuthToken.hashedValidator = _bcryptNodejs2.default.hashSync(newAuthToken.selector);
      },
      beforeUpdate: function beforeUpdate(newAuthToken) {
        newAuthToken.hashedValidator = _bcryptNodejs2.default.hashSync(newAuthToken.selector);
      }
    }
  });
  authTokens.associate = function (models) {
    // associations can be defined here
    authTokens.belongsTo(models.users, {
      foriegnKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return authTokens;
};