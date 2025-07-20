const { Order, OrderItem, CartItem, Product } = require("../models");

exports.create = async (req, res, next) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [Product],
    });
    if (!cartItems.length)
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty", data: null });
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.quantity * item.Product.price;
    });
    const order = await Order.create({
      userId: req.user.id,
      totalAmount,
      status: "Pending",
    });
    const orderItems = await Promise.all(
      cartItems.map((item) =>
        OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.Product.price,
        })
      )
    );
    await CartItem.destroy({ where: { userId: req.user.id } });
    res
      .status(201)
      .json({
        success: true,
        message: "Order created",
        data: { order, orderItems },
      });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [OrderItem],
    });
    res.json({ success: true, message: "Orders fetched", data: orders });
  } catch (err) {
    next(err);
  }
};

exports.details = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [OrderItem],
    });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found", data: null });
    res.json({ success: true, message: "Order details", data: order });
  } catch (err) {
    next(err);
  }
};
