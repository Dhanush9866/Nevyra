const { Product, Category, Seller, Order, OrderItem, Payout } = require("../models");
const { validateAttributes } = require("../utils/validateAttributes");

// Helper: Parse additional specs
function parseAdditionalSpecifications(specsString) {
    if (!specsString || typeof specsString !== 'string') {
        return {};
    }

    const specifications = {};
    const specsArray = specsString.split(';').filter(spec => spec.trim());

    specsArray.forEach(spec => {
        const [key, value] = spec.split(':').map(s => s.trim());
        if (key && value) {
            const cleanKey = key.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (value.includes(',')) {
                specifications[cleanKey] = value.split(',').map(v => v.trim()).filter(v => v);
            } else {
                specifications[cleanKey] = value;
            }
        }
    });

    return specifications;
}

// Helper: Map Product ID
function mapProductId(product) {
    if (!product) return product;
    const obj = product.toObject ? product.toObject() : { ...product };
    obj.id = obj._id;
    delete obj._id;

    if (obj.attributes && typeof obj.attributes === "object") {
        if (obj.attributes instanceof Map) {
            obj.attributes = Object.fromEntries(obj.attributes);
        } else if (obj.attributes.toObject) {
            obj.attributes = obj.attributes.toObject();
        }
    }

    if (obj.additionalSpecifications && typeof obj.additionalSpecifications === "object") {
        if (obj.additionalSpecifications instanceof Map) {
            obj.additionalSpecifications = Object.fromEntries(obj.additionalSpecifications);
        } else if (obj.additionalSpecifications.toObject) {
            obj.additionalSpecifications = obj.additionalSpecifications.toObject();
        }
    }
    return obj;
}

// --- Product Management ---

exports.createProduct = async (req, res, next) => {
    try {
        const {
            title, price, category, subCategory, images, inStock,
            rating, reviews, stockQuantity, soldCount, attributes, additionalSpecifications, lowStockThreshold,
            originalPrice, discount
        } = req.body;

        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller profile not found. Please create a seller profile first." });
        }

        if (!title || !price || !category || !images || !subCategory)
            return res.status(400).json({ success: false, message: "Missing required fields" });

        let categoryName = category;
        let subCategoryName = subCategory;

        if (category.match(/^[0-9a-fA-F]{24}$/)) {
            const categoryDoc = await Category.findById(category);
            if (!categoryDoc) return res.status(400).json({ success: false, message: "Category not found" });
            categoryName = categoryDoc.name;
        }

        if (subCategory.match(/^[0-9a-fA-F]{24}$/)) {
            const subCategoryDoc = await Category.findById(subCategory);
            if (!subCategoryDoc) return res.status(400).json({ success: false, message: "Subcategory not found" });
            subCategoryName = subCategoryDoc.name;
        }

        if (attributes && !validateAttributes(categoryName, attributes)) {
            return res.status(400).json({ success: false, message: "Invalid attributes for category" });
        }

        const parsedSpecs = additionalSpecifications ? parseAdditionalSpecifications(additionalSpecifications) : {};

        const product = new Product({
            title, price, category: categoryName, subCategory: subCategoryName, images,
            inStock, rating: rating || 0, reviews: reviews || 0,
            stockQuantity: stockQuantity || 0, soldCount: soldCount || 0,
            attributes, additionalSpecifications: parsedSpecs,
            seller: seller._id,
            lowStockThreshold: lowStockThreshold || 5,
            originalPrice: originalPrice || 0,
            discount: discount || 0
        });

        await product.save();

        res.status(201).json({ success: true, message: "Product created successfully", data: mapProductId(product) });
    } catch (err) { next(err); }
};

exports.getMyProducts = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

        const products = await Product.find({ seller: seller._id });
        const mappedProducts = products.map(mapProductId);

        res.json({ success: true, message: "Seller products fetched", data: mappedProducts });
    } catch (err) { next(err); }
};

exports.updateMyProduct = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        if (!product.seller || !product.seller.equals(seller._id)) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this product" });
        }

        const {
            title, price, category, subCategory, images, inStock,
            rating, reviews, stockQuantity, soldCount, attributes, additionalSpecifications, lowStockThreshold,
            originalPrice, discount
        } = req.body;

        let categoryName = category;
        let subCategoryName = subCategory;

        if (category !== undefined && category.match(/^[0-9a-fA-F]{24}$/)) {
            const categoryDoc = await Category.findById(category);
            if (categoryDoc) categoryName = categoryDoc.name;
        }
        if (subCategory !== undefined && subCategory.match(/^[0-9a-fA-F]{24}$/)) {
            const subCategoryDoc = await Category.findById(subCategory);
            if (subCategoryDoc) subCategoryName = subCategoryDoc.name;
        }

        if (title !== undefined) product.title = title;
        if (price !== undefined) product.price = price;
        if (category !== undefined) product.category = categoryName;
        if (subCategory !== undefined) product.subCategory = subCategoryName;
        if (images !== undefined) product.images = images;
        if (inStock !== undefined) product.inStock = inStock;
        if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
        if (lowStockThreshold !== undefined) product.lowStockThreshold = lowStockThreshold;
        if (attributes !== undefined) product.attributes = attributes;
        if (additionalSpecifications !== undefined) {
            product.additionalSpecifications = additionalSpecifications ? parseAdditionalSpecifications(additionalSpecifications) : {};
        }
        if (originalPrice !== undefined) product.originalPrice = originalPrice;
        if (discount !== undefined) product.discount = discount;

        await product.save();
        res.json({ success: true, message: "Product updated", data: mapProductId(product) });
    } catch (err) { next(err); }
};

exports.deleteMyProduct = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        if (!product.seller || !product.seller.equals(seller._id)) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this product" });
        }

        await product.deleteOne();
        res.json({ success: true, message: "Product deleted" });
    } catch (err) { next(err); }
};

// --- Order Management ---

exports.getMyOrders = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

        const products = await Product.find({ seller: seller._id }).select('_id');
        const productIds = products.map(p => p._id);

        if (productIds.length === 0) return res.json({ success: true, data: [] });

        const orderItems = await OrderItem.find({ productId: { $in: productIds } })
            .populate('productId')
            .populate('orderId')
            .sort({ createdAt: -1 });

        const orderMap = new Map();
        for (const item of orderItems) {
            const order = item.orderId;
            if (!order) continue;

            if (!orderMap.has(order._id.toString())) {
                orderMap.set(order._id.toString(), {
                    ...order.toObject(),
                    items: []
                });
            }
            orderMap.get(order._id.toString()).items.push(item);
        }

        const orders = Array.from(orderMap.values());
        await Order.populate(orders, { path: 'userId', select: 'firstName lastName email phone addresses' });

        res.json({ success: true, message: "Orders fetched", data: orders });
    } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const currentSeller = await Seller.findOne({ user: req.user.id });
        if (!currentSeller) return res.status(404).json({ success: false, message: "Seller not found" });

        // Verify this order actually contains a product from this seller
        const products = await Product.find({ seller: currentSeller._id }).select('_id');
        const productIds = products.map(p => p._id);

        const orderItemToCheck = await OrderItem.findOne({
            orderId: orderId,
            productId: { $in: productIds }
        });

        if (!orderItemToCheck) return res.status(403).json({ success: false, message: "You are not authorized" });

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        order.status = status;
        await order.save();

        // Process Payouts if Delivered
        if (status === 'Delivered') {
            const allItems = await OrderItem.find({ orderId: orderId, isPayoutProcessed: false }).populate('productId');

            const sellerUpdates = new Map();

            for (const item of allItems) {
                const product = item.productId;
                if (!product || !product.seller) continue;

                const sId = product.seller.toString();
                const earning = item.price * item.quantity;

                sellerUpdates.set(sId, (sellerUpdates.get(sId) || 0) + earning);

                item.isPayoutProcessed = true;
                await item.save();
            }

            for (const [sId, amount] of sellerUpdates.entries()) {
                await Seller.findByIdAndUpdate(sId, { $inc: { walletBalance: amount } });
            }
        }

        res.json({ success: true, message: "Order status updated", data: { id: order._id, status: order.status } });
    } catch (err) { next(err); }
};

exports.updateReturnStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;
        const allowedStatuses = ["Approved", "Rejected", "Success"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid return status" });
        }

        const currentSeller = await Seller.findOne({ user: req.user.id });
        if (!currentSeller) return res.status(404).json({ success: false, message: "Seller not found" });

        // Verify this order actually contains a product from this seller
        const products = await Product.find({ seller: currentSeller._id }).select('_id');
        const productIds = products.map(p => p._id);

        const orderItemToCheck = await OrderItem.findOne({
            orderId: orderId,
            productId: { $in: productIds }
        });

        if (!orderItemToCheck) return res.status(403).json({ success: false, message: "You are not authorized" });

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        order.returnStatus = status;
        await order.save();

        // Use different processing specific to returns if needed? 
        // For now just update status. 
        // If status is "Success", maybe trigger refund logic? (Not converting that part yet as per instruction just status)

        res.json({ success: true, message: "Return status updated", data: { id: order._id, returnStatus: order.returnStatus } });
    } catch (err) { next(err); }
};

// --- Wallet & Payouts ---

exports.getWallet = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

        const recentPayouts = await Payout.find({ sellerId: seller._id }).sort({ createdAt: -1 }).limit(10);

        const allPaid = await Payout.find({ sellerId: seller._id, status: 'Paid' });
        const totalPaid = allPaid.reduce((sum, p) => sum + p.amount, 0);

        const allPending = await Payout.find({ sellerId: seller._id, status: { $in: ['Pending', 'Processing'] } });
        const pendingAmount = allPending.reduce((sum, p) => sum + p.amount, 0);

        res.json({
            success: true,
            data: {
                balance: seller.walletBalance || 0,
                pendingPayouts: pendingAmount,
                totalPaid: totalPaid,
                recentPayouts,
                bankDetails: seller.bankDetails
            }
        });
    } catch (err) { next(err); }
};

exports.updateBankDetails = async (req, res, next) => {
    try {
        const { accountHolderName, accountNumber, ifscCode } = req.body;
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

        if (!accountHolderName || !accountNumber || !ifscCode) {
            return res.status(400).json({ success: false, message: "All bank fields are required" });
        }

        // Preserve existing cancelledCheque if not provided (though typically handled by upload separate flow)
        const currentCheque = seller.bankDetails ? seller.bankDetails.cancelledCheque : "";

        seller.bankDetails = {
            accountHolderName,
            accountNumber,
            ifscCode,
            cancelledCheque: currentCheque
        };

        await seller.save();
        res.json({ success: true, message: "Bank details updated", data: seller.bankDetails });
    } catch (err) { next(err); }
};

exports.requestPayout = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

        if (!amount || amount <= 0) return res.status(400).json({ success: false, message: "Invalid amount" });
        if (amount < 10000) return res.status(400).json({ success: false, message: "Minimum withdrawal amount is ₹10,000" });
        if (amount > (seller.walletBalance || 0)) return res.status(400).json({ success: false, message: "Insufficient balance" });

        const payout = new Payout({ sellerId: seller._id, amount, status: "Processing" });
        await payout.save();

        seller.walletBalance = (seller.walletBalance || 0) - amount;
        await seller.save();

        res.json({ success: true, message: "Payout requested", data: payout });
    } catch (err) { next(err); }
};

exports.getPayouts = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

        const payouts = await Payout.find({ sellerId: seller._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: payouts });
    } catch (err) { next(err); }
};

// --- Inventory Management ---

exports.getInventoryStats = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

        const products = await Product.find({ seller: seller._id });

        const totalProducts = products.length;
        const inStock = products.filter(p => p.stockQuantity > 0).length;
        const outOfStock = products.filter(p => p.stockQuantity === 0).length;
        const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5)).length;

        res.json({ success: true, data: { totalProducts, inStock, outOfStock, lowStock } });
    } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
    try {
        const seller = await Seller.findOne({ user: req.user.id });
        if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

        const products = await Product.find({ seller: seller._id }).select('_id');
        const productIds = products.map(p => p._id);
        const totalProducts = products.length;

        // Fetch all order items for these products and populate the parent order
        const orderItems = await OrderItem.find({ productId: { $in: productIds } }).populate('orderId');

        let totalSales = 0;
        const uniqueOrderIds = new Set();
        const uniquePendingOrderIds = new Set();

        orderItems.forEach(item => {
            if (!item.orderId) return;
            const order = item.orderId;

            uniqueOrderIds.add(order._id.toString());

            if (order.status === 'Delivered') {
                totalSales += (item.price * item.quantity);
            }

            if (order.status !== 'Delivered' && order.status !== 'Cancelled') {
                uniquePendingOrderIds.add(order._id.toString());
            }
        });

        res.json({
            success: true,
            data: {
                totalSales,
                totalOrders: uniqueOrderIds.size,
                totalProducts,
                pendingOrders: uniquePendingOrderIds.size,
                walletBalance: seller.walletBalance || 0
            }
        });
    } catch (err) { next(err); }
};
