module.exports = (sequelize, DataTypes) => {
  const feedback = sequelize.define('feedback', {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      }
    }
  });
  return feedback;
};
