const mongoose = require("mongoose");
const { Order, OrderItem, CartItem, Product } = require("../models");

exports.create = async (req, res, next) => {
  try {
    const { paymentMethod, paymentDetails, shippingAddress, items, totalAmount: providedTotal } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: "Shipping address is required" });
    }

    let orderItemsData = [];
    let finalTotalAmount = 0;
    let isCartOrder = false;

    // 1. Resolve Items
    if (items && Array.isArray(items) && items.length > 0) {
      // Direct checkout (Buy Now)
      for (const item of items) {
        if (!mongoose.Types.ObjectId.isValid(item.productId)) {
          throw new Error(`Invalid Product ID: ${item.productId}`);
        }
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        
        orderItemsData.push({
          productId: product._id,
          quantity: item.quantity || 1,
          price: product.price,
          selectedFeatures: item.selectedFeatures || {}
        });
        finalTotalAmount += (item.quantity || 1) * product.price;
      }
    } else {
      // Cart checkout
      const cartItems = await CartItem.find({ userId: req.user.id }).populate("productId");
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
      }
      
      isCartOrder = true;
      cartItems.forEach((item) => {
        orderItemsData.push({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
          selectedFeatures: item.selectedFeatures || {}
        });
        finalTotalAmount += item.quantity * (item.productId.price || 0);
      });
    }

    // 2. Create Order
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      userId: req.user.id,
      orderNumber,
      shippingAddress,
      totalAmount: providedTotal || finalTotalAmount,
      status: "Pending",
      paymentMethod: paymentMethod || "cod",
      paymentStatus: (paymentMethod === "razorpay" && paymentDetails?.razorpayPaymentId) ? "Paid" : "Pending",
      paymentDetails: paymentDetails || {},
    });
    
    await order.save();

    // 3. Create OrderItems
    const savedOrderItems = await Promise.all(
      orderItemsData.map((item) => {
        const orderItem = new OrderItem({
          orderId: order._id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedFeatures: item.selectedFeatures,
        });
        return orderItem.save();
      })
    );

    // 4. Cleanup (Only if it was a full cart order)
    if (isCartOrder) {
      await CartItem.deleteMany({ userId: req.user.id });
    } else {
      // Optional: If any of the "Buy Now" products were in the cart, remove them
      const productIds = orderItemsData.map(i => i.productId);
      await CartItem.deleteMany({ userId: req.user.id, productId: { $in: productIds } });
    }

    res.status(201).json({
      success: true,
      message: "Order created",
      data: { order, orderItems: savedOrderItems },
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: "Order not found (Invalid ID)", data: null });
    }
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: "Order not found (Invalid ID)", data: null });
    }
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: "Order not found (Invalid ID)" });
    }
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

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: "Order not found (Invalid ID)" });
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
