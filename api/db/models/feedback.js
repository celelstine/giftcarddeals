module.exports = (sequelize, DataTypes) => {
  const feedback = sequelize.define('feedback', {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
        as: 'sender',
        deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isclient: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
