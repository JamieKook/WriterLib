module.exports = function(sequelize, DataTypes) {
  const Author = sequelize.define("Author", {
    // The email cannot be null, and must be a proper email before creation
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true
        }
      },
    usePseudonym: DataTypes.BOOLEAN,
    pseudonym: {
        type: DataTypes.STRING,
        allowNull: true
    }

  });
  Author.associate = function(models) {
    Author.hasMany(models.Book, {
      onDelete: "cascade"
    });

    Author.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Author;
};
