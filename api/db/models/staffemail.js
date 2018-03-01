module.exports = (sequelize, DataTypes) => {
  const staffemail = sequelize.define('staffemail', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email format',
        },
      },
    },
  }, {
  });
  return staffemail;
};
