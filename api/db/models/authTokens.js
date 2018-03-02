import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const authTokens = sequelize.define('authTokens', {
    selector: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashedValidator: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      default: 'active',
    },
  }, {
    hooks: {
      /* eslint-disable no-param-reassign */
      beforeCreate(newAuthToken) {
        newAuthToken.hashedValidator = bcrypt.hashSync(newAuthToken.selector);
      },
      beforeUpdate(newAuthToken) {
        newAuthToken.hashedValidator = bcrypt.hashSync(newAuthToken.selector);
      },
    },
  });
  authTokens.associate = (models) => {
    // associations can be defined here
    authTokens.belongsTo(models.users, {
      foriegnKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return authTokens;
};
