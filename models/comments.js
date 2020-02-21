module.exports = function(sequelize, DataTypes) {
    const Comment = sequelize.define("Comment", {
      // The email cannot be null, and must be a proper email before creation
      // commenterId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false
      // },
      // bookId: {
      //     type: DataTypes.INTEGER,
      //     allowNull: false
      //   },
      // authorId: {
      //     type: DataTypes.INTEGER,
      //     allowNull: false
      // },
      comment: {
          type: DataTypes.TEXT,
          allowNull: true
      }
    });
    
    Comment.associate = function(models) {
        Comment.belongsTo(models.Book, {
          foreignKey: {
            allowNull: false
          }
        }); 

        // Comment.belongsTo(models.Author, {
        //   as: "Author",
        //   foreignKey: {
        //     allowNull: false
        //   }
        // });
    
        Comment.belongsTo(models.Author, {
          as: "Commentor",
          foreignKey: {
            allowNull: false
          }
        });
    }; 
    return Comment;
  };
  