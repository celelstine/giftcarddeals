'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('feedbacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      from: {
       type: Sequelize.INTEGER,
        defaultValue: 1,
        references: {
          model: 'users',
          key: 'id',
          as: 'sender',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isclient: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('feedbacks');
  }
};
