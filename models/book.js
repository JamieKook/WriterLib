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
        },
      type: {
          type: DataTypes.STRING,
          allowNull: true
      },
      description: {
          type: DataTypes.TEXT,
          allowNull: true
      },
      imageURL: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
    
    Book.associate = function(models) {
        Book.belongsTo(models.Author, {
          foreignKey: {
            allowNull: false
          }
        })
    }; 
    return Book;
  };
  
