const { Product, Category } = require("../models");
const { validateAttributes } = require("../utils/validateAttributes");

// Function to parse additional specifications
function parseAdditionalSpecifications(specsString) {
  if (!specsString || typeof specsString !== 'string') {
    return {};
  }
  
  const specifications = {};
  
  // Split by semicolon to get individual specifications
  const specsArray = specsString.split(';').filter(spec => spec.trim());
  
  specsArray.forEach(spec => {
    // Split by colon to separate key and value
    const [key, value] = spec.split(':').map(s => s.trim());
    
    if (key && value) {
      // Convert key to uppercase and clean it
      const cleanKey = key.toUpperCase().replace(/[^A-Z0-9]/g, '');
      
      // Handle multiple values separated by commas
      if (value.includes(',')) {
        specifications[cleanKey] = value.split(',').map(v => v.trim()).filter(v => v);
      } else {
        specifications[cleanKey] = value;
      }
    }
  });
  
  return specifications;
}

function mapProductId(product) {
  if (!product) return product;
  const obj = product.toObject ? product.toObject() : { ...product };
  obj.id = obj._id;
  delete obj._id;
  // Ensure attributes is a plain object
  if (obj.attributes && typeof obj.attributes === "object") {
    if (obj.attributes instanceof Map) {
      obj.attributes = Object.fromEntries(obj.attributes);
    } else if (obj.attributes.toObject) {
      obj.attributes = obj.attributes.toObject();
    }
  }
  // Ensure additionalSpecifications is a plain object
  if (obj.additionalSpecifications && typeof obj.additionalSpecifications === "object") {
    if (obj.additionalSpecifications instanceof Map) {
      obj.additionalSpecifications = Object.fromEntries(obj.additionalSpecifications);
    } else if (obj.additionalSpecifications.toObject) {
      obj.additionalSpecifications = obj.additionalSpecifications.toObject();
    }
  }
  return obj;
}

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, subCategory, search } = req.query;
    
    console.log('========== PRODUCT LIST REQUEST ==========');
    console.log('Query params:', { page, limit, category, subCategory, search });
    
    const filter = {};
    if (category) filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    if (subCategory) filter.subCategory = { $regex: new RegExp(`^${subCategory}$`, "i") };
    if (search) filter.title = { $regex: search, $options: "i" };
    
    console.log('MongoDB filter:', JSON.stringify(filter));
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log('Pagination:', { skip, limit: parseInt(limit) });
    
    const [products, count] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .select(
          "title price category subCategory images inStock rating reviews stockQuantity soldCount attributes"
        ),
      Product.countDocuments(filter),
    ]);
    
    console.log('Database results:', { 
      productsFound: products.length, 
      totalCount: count,
      firstProduct: products[0] ? products[0].title : 'none'
    });
    
    const mappedProducts = products.map(mapProductId);
    
    const response = {
      success: true,
      message: "Products fetched",
      data: mappedProducts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
    
    console.log('Response summary:', {
      dataLength: response.data.length,
      pagination: response.pagination
    });
    console.log('==========================================');
    
    res.json(response);
  } catch (err) {
    console.error('Error in product list:', err);
    next(err);
  }
};

// New endpoint for filtering by multiple subcategories (comma-separated)
exports.listByMultipleSubcategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, subCategories, search } = req.query;
    
    console.log('========== MULTI-SUBCATEGORY PRODUCT LIST REQUEST ==========');
    console.log('Query params:', { page, limit, category, subCategories, search });
    
    const filter = {};
    if (category) filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    
    // Handle comma-separated subcategories
    if (subCategories) {
      const subCategoryArray = subCategories.split(',').map(s => new RegExp(`^${s.trim()}$`, "i"));
      filter.subCategory = { $in: subCategoryArray };
    }
    
    if (search) filter.title = { $regex: search, $options: "i" };
    
    console.log('MongoDB filter:', JSON.stringify(filter));
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log('Pagination:', { skip, limit: parseInt(limit) });
    
    const [products, count] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .select(
          "title price category subCategory images inStock rating reviews stockQuantity soldCount attributes"
        ),
      Product.countDocuments(filter),
    ]);
    
    console.log('Database results:', { 
      productsFound: products.length, 
      totalCount: count,
      firstProduct: products[0] ? products[0].title : 'none'
    });
    
    const mappedProducts = products.map(mapProductId);
    
    const response = {
      success: true,
      message: "Products fetched by multiple subcategories",
      data: mappedProducts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
    
    console.log('Response summary:', {
      dataLength: response.data.length,
      pagination: response.pagination
    });
    console.log('==========================================');
    
    res.json(response);
  } catch (err) {
    console.error('Error in multi-subcategory product list:', err);
    next(err);
  }
};


exports.details = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
   
    const sendData = mapProductId(product);


    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });
    res.json({
      success: true,
      message: "Product details",
      data: sendData,
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      title,
      price,
      category,
      subCategory,
      images,
      inStock,
      rating,
      reviews,
      stockQuantity,
      soldCount,
      attributes,
      additionalSpecifications,
    } = req.body;
    
    if (!title || !price || !category || !images || !subCategory)
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        data: null,
      });
    
    // Resolve category and subcategory names from IDs
    let categoryName = category;
    let subCategoryName = subCategory;
    
    // Check if category is an ObjectId (24 character hex string)
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
          data: null,
        });
      }
      categoryName = categoryDoc.name;
    }
    
    // Check if subCategory is an ObjectId (24 character hex string)
    if (subCategory.match(/^[0-9a-fA-F]{24}$/)) {
      const subCategoryDoc = await Category.findById(subCategory);
      if (!subCategoryDoc) {
        return res.status(400).json({
          success: false,
          message: "Subcategory not found",
          data: null,
        });
      }
      subCategoryName = subCategoryDoc.name;
    }
    
    if (attributes && !validateAttributes(categoryName, attributes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attributes for category",
        data: null,
      });
    }
    
    // Parse additional specifications if provided
    const parsedSpecs = additionalSpecifications ? 
      parseAdditionalSpecifications(additionalSpecifications) : {};
    
    const product = new Product({
      title,
      price,
      category: categoryName,
      subCategory: subCategoryName,
      images,
      inStock,
      rating,
      reviews,
      stockQuantity,
      soldCount,
      attributes,
      additionalSpecifications: parsedSpecs,
    });
    await product.save();
    res.status(201).json({
      success: true,
      message: "Product created",
      data: mapProductId(product),
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });
    const {
      title,
      price,
      category,
      subCategory,
      images,
      inStock,
      rating,
      reviews,
      stockQuantity,
      soldCount,
      attributes,
      additionalSpecifications,
    } = req.body;
    
    // Resolve category and subcategory names from IDs if provided
    let categoryName = category;
    let subCategoryName = subCategory;
    
    if (category !== undefined) {
      // Check if category is an ObjectId (24 character hex string)
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
          return res.status(400).json({
            success: false,
            message: "Category not found",
            data: null,
          });
        }
        categoryName = categoryDoc.name;
      }
    }
    
    if (subCategory !== undefined) {
      // Check if subCategory is an ObjectId (24 character hex string)
      if (subCategory.match(/^[0-9a-fA-F]{24}$/)) {
        const subCategoryDoc = await Category.findById(subCategory);
        if (!subCategoryDoc) {
          return res.status(400).json({
            success: false,
            message: "Subcategory not found",
            data: null,
          });
        }
        subCategoryName = subCategoryDoc.name;
      }
    }
    
    if (categoryName && attributes && !validateAttributes(categoryName, attributes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attributes for category",
        data: null,
      });
    }
    if (title !== undefined) product.title = title;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = categoryName;
    if (subCategory !== undefined) product.subCategory = subCategoryName;
    if (images !== undefined) product.images = images;
    if (inStock !== undefined) product.inStock = inStock;
    if (rating !== undefined) product.rating = rating;
    if (reviews !== undefined) product.reviews = reviews;
    if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
    if (soldCount !== undefined) product.soldCount = soldCount;
    if (attributes !== undefined) product.attributes = attributes;
    if (additionalSpecifications !== undefined) {
      product.additionalSpecifications = additionalSpecifications ? 
        parseAdditionalSpecifications(additionalSpecifications) : {};
    }
    await product.save();
    res.json({
      success: true,
      message: "Product updated",
      data: mapProductId(product),
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found", data: null });
    await product.deleteOne();
    res.json({ success: true, message: "Product deleted", data: null });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.find();
    const mappedProducts = products.map(mapProductId);
    res.json({
      success: true,
      message: "All products fetched",
      data: mappedProducts,
    });
  } catch (err) {
    next(err);
  }
};
