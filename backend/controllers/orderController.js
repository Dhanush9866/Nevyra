const { Order, OrderItem, CartItem, Product } = require("../models");

exports.create = async (req, res, next) => {
  try {
    const { paymentMethod, paymentDetails } = req.body;

    const cartItems = await CartItem.find({ userId: req.user.id }).populate(
      "productId"
    );
    if (!cartItems.length)
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty", data: null });
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.quantity * (item.productId.price || 0);
    });
    const order = new Order({
      userId: req.user.id,
      totalAmount,
      status: "Pending",
      paymentMethod: paymentMethod || "cod",
      paymentStatus: (paymentMethod === "razorpay" && paymentDetails?.razorpayPaymentId) ? "Paid" : "Pending",
      paymentDetails: paymentDetails || {},
    });
    await order.save();
    const orderItems = await Promise.all(
      cartItems.map((item) => {
        const orderItem = new OrderItem({
          orderId: order._id,
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
          selectedFeatures: item.selectedFeatures || new Map(),
        });
        return orderItem.save();
      })
    );
    // Clear cart after successful order
    await CartItem.deleteMany({ userId: req.user.id });
    res.status(201).json({
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
    const orders = await Order.find({ userId: req.user.id }).lean();
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).populate('productId');
        return { ...order, items };
      })
    );
    res.json({
      success: true,
      message: "Orders fetched",
      data: ordersWithItems,
    });
  } catch (err) {
    next(err);
  }
};

exports.details = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found", data: null });
    const items = await OrderItem.find({ orderId: order._id }).populate('productId');
    res.json({
      success: true,
      message: "Order details",
      data: { ...order.toObject(), items },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    let query = { _id: req.params.id };
    // If not admin, restrict to own orders
    if (!req.user.isAdmin) {
      query.userId = req.user.id;
    }
    const order = await Order.findOne(query);
    if (!order) return res.status(404).json({ success: false, message: "Order not found", data: null });
    order.status = status || order.status;
    await order.save();
    res.json({ success: true, message: "Order status updated", data: { id: order._id, status: order.status } });
  } catch (err) { next(err); }
};

// Admin: list all orders with user and items populated
exports.adminList = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'firstName lastName email phone addresses').lean();
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).populate('productId');
        return { ...order, items };
      })
    );
    res.json({ success: true, message: 'Orders fetched', data: ordersWithItems });
  } catch (err) { next(err); }
};

exports.requestReturn = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({ success: false, message: "Only delivered orders can be returned" });
    }

    if (order.returnStatus && order.returnStatus !== "None") {
      return res.status(400).json({ success: false, message: "Return request already exists" });
    }

    order.returnStatus = "Pending";
    order.returnReason = reason;
    await order.save();

    res.json({ success: true, message: "Return request submitted", data: order });
  } catch (err) {
    next(err);
  }
};

exports.updateReturnStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Approved", "Rejected", "Success"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid return status" });
    }

    // Since this is called by admin/seller, we don't restrict by userId
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.returnStatus = status;
    await order.save();

    res.json({ success: true, message: "Return status updated", data: order });
  } catch (err) {
    next(err);
  }
};
