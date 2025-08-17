const { Order } = require("../models");
const { User } = require("../models");

// Create new order
exports.createOrder = async (req, res, next) => {
  try {
    console.log("Create order request body:", req.body);
    console.log("User from request:", req.user);
    
    const {
      items,
      shippingAddress,
      paymentMethod,
      notes,
      subtotal,
      shippingCost = 0,
      tax = 0,
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("Validation failed: items missing or invalid");
      return res.status(400).json({
        success: false,
        message: "Order items are required",
        data: null,
      });
    }

    if (!shippingAddress) {
      console.log("Validation failed: shippingAddress missing");
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
        data: null,
      });
    }

    if (!paymentMethod) {
      console.log("Validation failed: paymentMethod missing");
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
        data: null,
      });
    }

    // Calculate total amount
    const totalAmount = subtotal + shippingCost + tax;
    console.log("Calculated total amount:", totalAmount);

    // Create order
    const orderData = {
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      notes,
    };
    
    console.log("Creating order with data:", orderData);
    
    const order = new Order(orderData);
    console.log("Order instance created:", order);

    await order.save();
    console.log("Order saved successfully:", order._id);

    // Populate user details for response
    await order.populate("user", "firstName lastName email");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: order,
    });
  } catch (err) {
    console.error("Create order error:", err);
    console.error("Error stack:", err.stack);
    next(err);
  }
};

// Get user orders (sorted by recent first)
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // Most recent first
      .populate("items.productId", "name image price")
      .select("-__v");

    return res.json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (err) {
    console.error("Get user orders error:", err);
    next(err);
  }
};

// Get single order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    })
      .populate("items.productId", "name image price description")
      .populate("user", "firstName lastName email phone")
      .select("-__v");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (err) {
    console.error("Get order by ID error:", err);
    next(err);
  }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    // Only allow cancellation of pending or confirmed orders
    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
        data: null,
      });
    }

    order.orderStatus = "cancelled";
    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    console.error("Cancel order error:", err);
    next(err);
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
        data: null,
      });
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    return res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (err) {
    console.error("Update order status error:", err);
    next(err);
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "firstName lastName email")
      .select("-__v");

    const total = await Order.countDocuments();

    return res.json({
      success: true,
      message: "Orders retrieved successfully",
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error("Get all orders error:", err);
    next(err);
  }
};
