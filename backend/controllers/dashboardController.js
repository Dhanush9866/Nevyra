const { Product } = require("../models");
const { Order } = require("../models");
const { User } = require("../models");

exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get current date and date ranges
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Parallel queries for better performance
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      todayOrders,
      lowStockProducts,
      totalCategories,
      monthlyRevenue,
      lastMonthRevenue,
      recentOrders,
      topProducts
    ] = await Promise.all([
      // Total products
      Product.countDocuments(),
      
      // Total orders
      Order.countDocuments(),
      
      // Total users
      User.countDocuments(),
      
      // Today's orders
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      
      // Low stock products (stock <= 10)
      Product.countDocuments({ stockQuantity: { $lte: 10 } }),
      
      // Total categories (assuming we have a Category model)
      Product.distinct('category').then(categories => categories.length),
      
      // Monthly revenue
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Last month revenue for comparison
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Recent orders (last 5)
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'firstName lastName email')
        .select('orderNumber totalAmount status createdAt'),
      
      // Top selling products
      Product.find()
        .sort({ soldCount: -1 })
        .limit(5)
        .select('title soldCount price images')
    ]);

    // Calculate revenue growth
    const currentRevenue = monthlyRevenue[0]?.total || 0;
    const previousRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
      : 0;

    // Calculate order growth (comparing today vs yesterday)
    const yesterday = new Date(startOfToday);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayOrders = await Order.countDocuments({ 
      createdAt: { $gte: yesterday, $lt: startOfToday } 
    });
    const orderGrowth = yesterdayOrders > 0 
      ? ((todayOrders - yesterdayOrders) / yesterdayOrders * 100).toFixed(1)
      : 0;

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 
      ? (currentRevenue / totalOrders).toFixed(2)
      : 0;

    // Get processing and shipped orders
    const [processingOrders, shippedOrders] = await Promise.all([
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'shipped' })
    ]);

    const stats = {
      overview: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalCategories,
        monthlyRevenue: currentRevenue,
        revenueGrowth: parseFloat(revenueGrowth),
        avgOrderValue: parseFloat(avgOrderValue)
      },
      today: {
        orders: todayOrders,
        orderGrowth: parseFloat(orderGrowth)
      },
      orders: {
        processing: processingOrders,
        shipped: shippedOrders,
        total: totalOrders
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
        categories: totalCategories
      },
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        customer: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : 'Guest',
        amount: order.totalAmount,
        status: order.status,
        date: order.createdAt
      })),
      topProducts: topProducts.map(product => ({
        id: product._id,
        title: product.title,
        soldCount: product.soldCount,
        price: product.price,
        image: product.images[0] || null
      }))
    };

    res.json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    next(error);
  }
};

exports.getQuickStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      monthlyRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      todayOrders,
      lowStockProducts
    ] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Product.countDocuments({ stockQuantity: { $lte: 10 } })
    ]);

    const stats = {
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      totalOrders,
      totalUsers,
      totalProducts,
      todayOrders,
      lowStockProducts
    };

    res.json({
      success: true,
      message: "Quick stats fetched successfully",
      data: stats
    });

  } catch (error) {
    next(error);
  }
};
