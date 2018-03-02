'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        defaultValue: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Invalid email format'
          }
        }
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'active'
      },
      user_category: {
        type: Sequelize.STRING,
        allowNull: true,
        default: 'customer'
      },
      firstname: {
        type: Sequelize.STRING,
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
      lastname: {
        type: Sequelize.STRING,
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
      othernames: {
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
    return queryInterface.dropTable('users');
  }
};