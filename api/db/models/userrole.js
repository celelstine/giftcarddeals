module.exports = (sequelize, DataTypes) => {
  const userRole = sequelize.define('userRole', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          arg: [2, 30],
          msg: 'should contain between 2 to 30 character'
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pagesDescription: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      default: [],
    },
  }, {
    classMethods: {
      associate(models) {
        // associations can be defined here
      },
    },
  });
  return userRole;
};
