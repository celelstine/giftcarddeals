'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
      },
      orderId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      giftcardsUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: 'Invalid email format'
          }
        }
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      rate: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      highDenominationRate: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      cardCurrency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bankAccountNumber: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      bankAccountName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      extra: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function down(queryInterface, Sequelize) {
    return queryInterface.dropTable('orders');
  }
};