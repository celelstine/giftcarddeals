'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('userRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
       type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: {
            args: ['^[a-z]+$', 'i'],
            msg: 'should contain only  alphabets'
          },
          len: {
            arg: [3, 30],
            msg: 'should contain between 23 to 20 letters'
          }
        }
      },
      description: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      pagesDescription: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
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
    return queryInterface.dropTable('userRoles');
  }
};
