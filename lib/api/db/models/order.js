'use strict';

module.exports = function (sequelize, DataTypes) {
  var order = sequelize.define('order', {
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    highDenominationRate: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    giftcardsUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cardCurrency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subject: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      defaultValue: false,
      validate: {
        isEmail: {
          msg: 'Invalid email format'
        }
      }
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bankAccountNumber: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    bankAccountName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    extra: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});
  order.associate = function (models) {
    // associations can be defined here
    // has parent table Role
    order.belongsTo(models.users, {
      foriegnKey: 'clientId',
      onDelete: 'CASCADE'
    });

    // an order has many feedback
    order.hasMany(models.feedback, {
      foriegnKey: 'orderId',
      as: 'feedback',
      onDelete: 'CASCADE'
    });
  };
  return order;
};