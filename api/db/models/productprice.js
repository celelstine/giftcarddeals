module.exports = (sequelize, DataTypes) => {
  const productPrice = sequelize.define('productPrice', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    bulkrate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    extra: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cardCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });
  return productPrice;
};
