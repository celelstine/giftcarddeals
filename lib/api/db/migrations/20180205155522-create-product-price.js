'use strict';

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return queryInterface.createTable('productPrices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      rate: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      bulkrate: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      extra: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cardCurrency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
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
  down: function down(queryInterface, Sequelize) {
    return queryInterface.dropTable('productPrices');
  }
};


INSERT INTO "public"."productPrices"("name", "rate", "image_url", "extra", "createdAt", "updatedAt", "cardCurrency", "bulkrate") VALUES('Generic card', 30, '/gift_card_blue.png', 'US gift card', '2018-02-13 10:47:28.336+01', '2018-02-20 06:20:20.759+01', '$', 35) RETURNING "id", "name", "rate", "image_url", "extra", "createdAt", "updatedAt", "cardCurrency", "bulkrate";
