const path = require("path");

module.exports = {
  User: require(path.join(__dirname, "User.js")),
  Product: require(path.join(__dirname, "Product.js")),
  Order: require(path.join(__dirname, "Order.js")),
  OrderItem: require(path.join(__dirname, "OrderItem.js")),
  CartItem: require(path.join(__dirname, "CartItem.js")),
  Category: require(path.join(__dirname, "Category.js")),
};
