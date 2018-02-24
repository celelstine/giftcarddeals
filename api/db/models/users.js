import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: ['^[a-z]+$', 'i'],
          msg: 'last name should contain only  alphabets',
        },
        len: {
          arg: [2, 20],
          msg: 'last name should contain between 2 to 20 letters',
        },
      },
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: ['^[a-z]+$', 'i'],
          msg: 'first name should contain only alphabets',
        },
        len: {
          arg: [2, 20],
          msg: 'first name should contain between 2 to 20 letters',
        },
      },
    },
    othernames: {
      type: DataTypes.STRING,
      allowNull: true,
    },
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [10, 20],
          msg: 'password should contain between 10 to 20 characters',
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_category: {
      type: DataTypes.STRING,
      allowNull: true,
      default: 'customer',
    },
  }, {
    hooks: {
      /* eslint-disable no-param-reassign */
      beforeCreate(newuser) {
        newuser.password = bcrypt.hashSync(newuser.password);
      },
      beforeUpdate(newuser) {
        newuser.password = bcrypt.hashSync(newuser.password);
      },
    },
  });

  users.associate = (models) => {
    // associations can be defined here
    // user can have many orders
    users.hasMany(models.order, {
      foriegnKey: 'clientId',
      as: 'orders',
      onDelete: 'CASCADE',
    });
    users.hasMany(models.authTokens, {
      foriegnKey: 'userId',
      as: 'authToken',
      onDelete: 'CASCADE',
    });
  };
  return users;
};
