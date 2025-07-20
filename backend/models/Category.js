const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true,
      tableName: "categories",
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Product, { foreignKey: "categoryId" });
  };

  return Category;
};
