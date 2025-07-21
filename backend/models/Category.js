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
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "categories", key: "id" },
      },
    },
    {
      timestamps: true,
      tableName: "categories",
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: "categoryId",
      as: "products",
    });
    Category.hasMany(models.Category, {
      foreignKey: "parentId",
      as: "subcategories",
    });
    Category.belongsTo(models.Category, {
      foreignKey: "parentId",
      as: "parent",
    });
  };

  return Category;
};
