'use strict';

module.exports = function (sequelize, DataTypes) {
  var productPrice = sequelize.define('productPrice', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    acronym: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    highDenominationRate: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    extra: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cardCurrency: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function associate(models) {
        // associations can be defined here
      }
    }
  });
  return productPrice;
};