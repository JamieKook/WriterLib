module.exports = function(sequelize, DataTypes) {
    const Book = sequelize.define("Book", {
      // The email cannot be null, and must be a proper email before creation
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      genre: {
          type: DataTypes.STRING,
          allowNull: true
        }
    });
    
    Book.associate = function(models) {
        Book.belongsTo(models.Author, {
          foreignKey: {
            allowNull: false
          }
        });
        Book.hasMany(models.Page, {
            onDelete: "cascade"
        });
    }; 
    return Book;
  };
  