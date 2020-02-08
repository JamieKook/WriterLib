module.exports = function(sequelize, DataTypes) {
    const Page = sequelize.define("Page", {
      // The email cannot be null, and must be a proper email before creation
      fileLink: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isCover: DataTypes.BOOLEAN
    });
    
    Page.associate = function(models) {
        Page.belongsTo(models.Book, {
          foreignKey: {
            allowNull: false
          }
        });
      };


    return Page;
  };