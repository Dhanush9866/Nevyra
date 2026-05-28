const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const API_BASE = "http://localhost:8000/api/v1";

// We require models to read OTP or perform database cleanup
const { User, Seller, Product, Order, OrderItem, CartItem, WishlistItem, Payout, Review, Category } = require("../models");

const testEmail = `test_flow_${Date.now()}@example.com`;
const testPassword = "Password@123";
let userToken = "";
let userId = "";
let adminToken = "";
let testProduct = null;
let testCategory = null;
let testSubCategory = null;

let reportText = `====================================================
NEVYRA E-COMMERCE API FLOW VERIFICATION REPORT
Generated on: ${new Date().toISOString()}
====================================================\n\n`;

function log(msg) {
  console.log(msg);
  reportText += `${msg}\n`;
}

function logError(title, err) {
  const errMsg = err.message || JSON.stringify(err);
  console.error(`❌ [ERROR] ${title}:`, errMsg);
  reportText += `❌ [ERROR] ${title}: ${errMsg}\n`;
}

async function run() {
  try {
    log("Connecting to database for setup/cleanup...");
    await mongoose.connect(MONGO_URI);
    log("✅ Connected to MongoDB.");

    // Clean up any old test users
    await User.deleteMany({ email: /test_flow_/ });
    log("🧹 Cleaned up old test users.");

    // 1. AUTH FLOWS
    log("\n--- 1. Testing Authentication Endpoints ---");
    
    // Register
    const regPayload = {
      firstName: "Test",
      lastName: "User",
      email: testEmail,
      phone: "+91" + Math.floor(6000000000 + Math.random() * 4000000000),
      password: testPassword,
      address: "123 Test Street"
    };
    
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regPayload)
    });
    
    const regData = await regRes.json();
    if (regRes.status === 201 && regData.success) {
      log(`✅ User registered successfully. Email: ${testEmail}`);
      userId = regData.data.id;
    } else {
      log(`❌ User registration failed: Status ${regRes.status}, Message: ${regData.message}`);
    }

    // Login
    const loginPayload = { email: testEmail, password: testPassword };
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginPayload)
    });
    const loginData = await loginRes.json();
    if (loginRes.status === 200 && loginData.success) {
      userToken = loginData.data.token;
      log("✅ Login successful. Token obtained.");
    } else {
      log(`❌ Login failed: Status ${loginRes.status}, Message: ${loginData.message}`);
    }

    // Get Profile
    const profileRes = await fetch(`${API_BASE}/auth/profile`, {
      headers: { "Authorization": `Bearer ${userToken}` }
    });
    const profileData = await profileRes.json();
    if (profileRes.ok && profileData.success) {
      log(`✅ Profile fetched: ${profileData.data.firstName} ${profileData.data.lastName}`);
    } else {
      log(`❌ Profile fetch failed: Status ${profileRes.status}`);
    }

    // Update Profile (PATCH)
    const patchPayload = { firstName: "UpdatedTest", lastName: "UpdatedUser" };
    const patchRes = await fetch(`${API_BASE}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify(patchPayload)
    });
    const patchData = await patchRes.json();
    if (patchRes.ok && patchData.success) {
      log(`✅ Profile updated (PATCH) successfully: ${patchData.data.firstName} ${patchData.data.lastName}`);
    } else {
      log(`❌ Profile update failed: Status ${patchRes.status}, Message: ${patchData.message}`);
    }

    // Forgot Password OTP
    const forgotRes = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail })
    });
    const forgotData = await forgotRes.json();
    
    // Note: Email sending might fail due to bad credentials, but the OTP gets saved to the user record first
    if (forgotRes.ok && forgotData.success) {
      log("✅ Forgot password OTP requested successfully.");
    } else {
      log(`⚠️  Forgot password request failed (likely due to SMTP/nodemailer config): Status ${forgotRes.status}, Message: ${forgotData.message}`);
      log("👉 Proceeding with direct DB check for generated OTP...");
    }
    
    // Let's fetch the OTP directly from DB for verification
    const user = await User.findOne({ email: testEmail });
    const otp = user ? user.resetPasswordOTP : null;
    log(`🔑 Direct DB Query - OTP for password reset: ${otp}`);
    
    if (otp) {
      // Verify OTP
      const verifyOtpRes = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, otp })
      });
      const verifyOtpData = await verifyOtpRes.json();
      if (verifyOtpRes.ok && verifyOtpData.success) {
        log("✅ OTP verification endpoint success.");
        
        // Reset Password
        const resetRes = await fetch(`${API_BASE}/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: testEmail, otp, newPassword: "NewStrongPassword@123" })
        });
        const resetData = await resetRes.json();
        if (resetRes.ok && resetRes.status < 400 && resetData.success) {
          log("✅ Password reset successful.");
          
          // Re-login with new password
          const reloginRes = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: testEmail, password: "NewStrongPassword@123" })
          });
          const reloginData = await reloginRes.json();
          if (reloginRes.ok && reloginData.success) {
            userToken = reloginData.data.token;
            log("✅ Re-login with new password success.");
          } else {
            log("❌ Re-login failed after password reset.");
          }
        } else {
          log(`❌ Reset password failed: ${resetData ? resetData.message : "HTTP Error"}`);
        }
      } else {
        log(`❌ OTP verification failed: ${verifyOtpData ? verifyOtpData.message : "HTTP Error"}`);
      }
    } else {
      log("❌ Skipping OTP/reset-password endpoints verification since no OTP was saved in the DB.");
    }

    // 2. ADDRESS FLOWS
    log("\n--- 2. Testing Address Management Endpoints ---");
    
    // Add Address
    const addressPayload = {
      firstName: "TestAddress",
      lastName: "User",
      email: testEmail,
      phone: "9876543210",
      addressLine1: "Flat 402, Highrise Apartments",
      addressLine2: "Sector 5",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001"
    };
    
    const addAddrRes = await fetch(`${API_BASE}/auth/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify(addressPayload)
    });
    const addAddrData = await addAddrRes.json();
    if (addAddrRes.status === 201 && addAddrData.success) {
      log("✅ Address added successfully.");
    } else {
      log(`❌ Add address failed: Status ${addAddrRes.status}, Message: ${addAddrData.message}`);
    }

    // Update Address (Index 0)
    const updateAddressPayload = {
      ...addressPayload,
      addressLine1: "Updated Address Flat 402",
      city: "Bengaluru"
    };
    const updateAddrRes = await fetch(`${API_BASE}/auth/addresses/0`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify(updateAddressPayload)
    });
    const updateAddrData = await updateAddrRes.json();
    if (updateAddrRes.ok && updateAddrData.success) {
      log("✅ Address updated (PATCH) successfully.");
    } else {
      log(`❌ Update address failed: Status ${updateAddrRes.status}, Message: ${updateAddrData.message}`);
    }

    // Get Addresses
    const getAddrRes = await fetch(`${API_BASE}/auth/addresses`, {
      headers: { "Authorization": `Bearer ${userToken}` }
    });
    const getAddrData = await getAddrRes.json();
    if (getAddrRes.ok && getAddrData.success) {
      log(`✅ Fetch addresses success. Count: ${getAddrData.data.length}`);
    } else {
      log(`❌ Fetch addresses failed: Status ${getAddrRes.status}`);
    }

    // 3. PRODUCT & CATEGORY FLOWS
    log("\n--- 3. Testing Category and Product Listing Endpoints ---");
    
    // Get Categories
    const categoriesRes = await fetch(`${API_BASE}/categories`);
    const categoriesData = await categoriesRes.json();
    if (categoriesRes.ok && categoriesData.success) {
      log(`✅ Categories fetched. Total count: ${categoriesData.data.length}`);
      
      // Let's locate subcategories
      testSubCategory = categoriesData.data.find(c => c.parentId);
      if (testSubCategory) {
        testCategory = categoriesData.data.find(c => c._id.toString() === testSubCategory.parentId.toString());
      }
      if (!testCategory) {
        testCategory = categoriesData.data[0];
      }
      log(`📂 Test Category: ${testCategory?.name} (ID: ${testCategory?._id})`);
      log(`📂 Test SubCategory: ${testSubCategory?.name} (ID: ${testSubCategory?._id})`);
    } else {
      log(`❌ Fetch categories failed: Status ${categoriesRes.status}`);
    }

    // Get Products
    const productsRes = await fetch(`${API_BASE}/products?limit=5`);
    const productsData = await productsRes.json();
    if (productsRes.ok && productsData.success) {
      log(`✅ Products fetched. Count: ${productsData.data.length}`);
      if (productsData.data.length > 0) {
        testProduct = productsData.data[0];
        log(`🛍️  Test Product: ${testProduct.title} (ID: ${testProduct.id || testProduct._id})`);
      }
    } else {
      log(`❌ Fetch products failed: Status ${productsRes.status}`);
    }

    // Get Similar Products
    if (testProduct) {
      const pid = testProduct.id || testProduct._id;
      const simRes = await fetch(`${API_BASE}/products/${pid}/similar`);
      const simData = await simRes.json();
      if (simRes.ok && simData.success) {
        log(`✅ Similar products fetched. Count: ${simData.data.length}`);
      } else {
        log(`❌ Fetch similar products failed: Status ${simRes.status}, Message: ${simData.message}`);
      }
    }

    // 4. WISHLIST FLOWS
    log("\n--- 4. Testing Wishlist Endpoints ---");
    if (testProduct) {
      const pid = testProduct.id || testProduct._id;
      
      // Add to Wishlist
      const addWishRes = await fetch(`${API_BASE}/users/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ productId: pid })
      });
      const addWishData = await addWishRes.json();
      if (addWishRes.ok && addWishData.success) {
        log("✅ Added product to wishlist.");
      } else {
        log(`❌ Add to wishlist failed: Status ${addWishRes.status}, Message: ${addWishData.message}`);
      }

      // Get Wishlist
      const getWishRes = await fetch(`${API_BASE}/users/wishlist`, {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      const getWishData = await getWishRes.json();
      let wishlistItemId = "";
      if (getWishRes.ok && getWishData.success) {
        log(`✅ Wishlist fetched. Count: ${getWishData.data.length}`);
        if (getWishData.data.length > 0) {
          wishlistItemId = getWishData.data[0]._id;
        }
      } else {
        log(`❌ Fetch wishlist failed: Status ${getWishRes.status}`);
      }

      // Remove from Wishlist (Test by Product ID first, validating our patch!)
      log(`🗑️ Testing Wishlist deletion by Product ID: ${pid}...`);
      const removeWishPidRes = await fetch(`${API_BASE}/users/wishlist/${pid}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      const removeWishPidData = await removeWishPidRes.json();
      if (removeWishPidRes.ok && removeWishPidData.success) {
        log("✅ Removed from wishlist successfully using Product ID.");
      } else {
        log(`❌ Remove from wishlist using Product ID failed: Status ${removeWishPidRes.status}, Message: ${removeWishPidData.message}`);
      }

      // Re-add to test deleting by Wishlist Item ID
      await fetch(`${API_BASE}/users/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ productId: pid })
      });
      const getWishRes2 = await fetch(`${API_BASE}/users/wishlist`, {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      const getWishData2 = await getWishRes2.json();
      if (getWishData2.data && getWishData2.data.length > 0) {
        wishlistItemId = getWishData2.data[0]._id;
        log(`🗑️ Testing Wishlist deletion by Wishlist Item ID: ${wishlistItemId}...`);
        const removeWishIdRes = await fetch(`${API_BASE}/users/wishlist/${wishlistItemId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${userToken}` }
        });
        const removeWishIdData = await removeWishIdRes.json();
        if (removeWishIdRes.ok && removeWishIdData.success) {
          log("✅ Removed from wishlist successfully using Wishlist Item ID.");
        } else {
          log(`❌ Remove from wishlist using Wishlist Item ID failed: Status ${removeWishIdRes.status}`);
        }
      }
    }

    // 5. CART FLOWS
    log("\n--- 5. Testing Cart Endpoints ---");
    let cartItemId = "";
    if (testProduct) {
      const pid = testProduct.id || testProduct._id;
      
      // Add to Cart
      const addCartRes = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({
          productId: pid,
          quantity: 2,
          selectedFeatures: { Color: "Black", Size: "M" }
        })
      });
      const addCartData = await addCartRes.json();
      if (addCartRes.status === 201 && addCartData.success) {
        log("✅ Added product to cart.");
        cartItemId = addCartData.data._id;
      } else {
        log(`❌ Add to cart failed: Status ${addCartRes.status}, Message: ${addCartData.message}`);
      }

      // Update Cart Item (PUT)
      if (cartItemId) {
        const updateCartRes = await fetch(`${API_BASE}/cart/${cartItemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
          },
          body: JSON.stringify({ quantity: 5 })
        });
        const updateCartData = await updateCartRes.json();
        if (updateCartRes.ok && updateCartData.success) {
          log("✅ Updated cart item quantity successfully.");
        } else {
          log(`❌ Update cart item failed: Status ${updateCartRes.status}, Message: ${updateCartData.message}`);
        }
      }

      // Get Cart
      const getCartRes = await fetch(`${API_BASE}/cart`, {
        headers: { "Authorization": `Bearer ${userToken}` }
      });
      const getCartData = await getCartRes.json();
      if (getCartRes.ok && getCartData.success) {
        log(`✅ Cart fetched. Item count: ${getCartData.data.length}`);
      } else {
        log(`❌ Fetch cart failed: Status ${getCartRes.status}`);
      }
    }

    // 6. REVIEW FLOWS
    log("\n--- 6. Testing Product Review Endpoints ---");
    if (testProduct) {
      const pid = testProduct.id || testProduct._id;
      let reviewId = "";
      
      // Create Review
      const reviewPayload = {
        rating: 5,
        title: "Excellent product",
        comment: "Perfect quality, fits perfectly!",
        images: ["http://example.com/review1.jpg"]
      };
      const createRevRes = await fetch(`${API_BASE}/reviews/product/${pid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(reviewPayload)
      });
      const createRevData = await createRevRes.json();
      if (createRevRes.status === 201 && createRevData.success) {
        log("✅ Review created successfully.");
        reviewId = createRevData.data._id;
      } else {
        log(`❌ Create review failed: Status ${createRevRes.status}, Message: ${createRevData.message}`);
      }

      // Update Review (PUT)
      if (reviewId) {
        const updateRevRes = await fetch(`${API_BASE}/reviews/${reviewId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
          },
          body: JSON.stringify({ rating: 4, comment: "Slightly delayed but good." })
        });
        const updateRevData = await updateRevRes.json();
        if (updateRevRes.ok && updateRevData.success) {
          log("✅ Review updated successfully.");
        } else {
          log(`❌ Update review failed: Status ${updateRevRes.status}, Message: ${updateRevData.message}`);
        }

        // Delete Review
        const delRevRes = await fetch(`${API_BASE}/reviews/${reviewId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${userToken}` }
        });
        const delRevData = await delRevRes.json();
        if (delRevRes.ok && delRevData.success) {
          log("✅ Review deleted successfully.");
        } else {
          log(`❌ Delete review failed: Status ${delRevRes.status}, Message: ${delRevData.message}`);
        }
      }
    }

    // 7. PAYMENTS & ORDER FLOWS
    log("\n--- 7. Testing Payments and Checkout Endpoints ---");
    
    // Create Payment Order
    const payOrderRes = await fetch(`${API_BASE}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify({ amount: 1500 }) // Rupee value
    });
    const payOrderData = await payOrderRes.json();
    let paymentOrderId = "";
    if (payOrderRes.ok && payOrderData.success) {
      log(`✅ Payment order created. Order ID: ${payOrderData.data.orderId}`);
      paymentOrderId = payOrderData.data.orderId;
    } else {
      log(`❌ Create payment order failed: Status ${payOrderRes.status}, Message: ${payOrderData.message}`);
    }

    // Verify Payment (using verify-mock for safety)
    if (paymentOrderId) {
      const verifyPayload = {
        razorpay_order_id: paymentOrderId,
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_signature: "mock_signature_123"
      };
      const verifyRes = await fetch(`${API_BASE}/payments/verify-mock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(verifyPayload)
      });
      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        log("✅ Payment signature verified (Mock).");
      } else {
        log(`❌ Payment signature verification failed: Status ${verifyRes.status}`);
      }
    }

    // Place Order (Full cart order)
    const orderPayload = {
      paymentMethod: "cod",
      shippingAddress: {
        firstName: "TestAddress",
        lastName: "User",
        email: testEmail,
        phone: "9876543210",
        addressLine1: "Flat 402, Highrise Apartments",
        city: "Bangalore",
        state: "Karnataka",
        zipCode: "560001"
      }
    };
    
    const placeOrderRes = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify(orderPayload)
    });
    const placeOrderData = await placeOrderRes.json();
    let orderId = "";
    if (placeOrderRes.status === 201 && placeOrderData.success) {
      log(`✅ Order placed successfully. Order Number: ${placeOrderData.data.order.orderNumber}`);
      orderId = placeOrderData.data.order._id;
    } else {
      log(`❌ Order placement failed: Status ${placeOrderRes.status}, Message: ${placeOrderData.message}`);
    }

    // Get Orders list
    const getOrdersRes = await fetch(`${API_BASE}/orders`, {
      headers: { "Authorization": `Bearer ${userToken}` }
    });
    const getOrdersData = await getOrdersRes.json();
    if (getOrdersRes.ok && getOrdersData.success) {
      log(`✅ Customer orders fetched. Count: ${getOrdersData.data.length}`);
    } else {
      log(`❌ Fetch customer orders failed: Status ${getOrdersRes.status}`);
    }

    // Cancel Order
    if (orderId) {
      const cancelRes = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ status: "Cancelled" })
      });
      const cancelData = await cancelRes.json();
      if (cancelRes.ok && cancelData.success) {
        log("✅ Order cancelled successfully.");
      } else {
        log(`❌ Cancel order failed: Status ${cancelRes.status}, Message: ${cancelData.message}`);
      }
    }

    // 8. SELLER FLOWS
    log("\n--- 8. Testing Seller Endpoints ---");
    
    // Register as Seller
    const createSellerPayload = {
      storeName: `Test Seller Store ${Date.now()}`,
      sellerType: "Individual",
      gstNumber: "29AAAAA0000A1Z5",
      businessAddress: "456 Business Road, Tech Park, Bangalore"
    };
    const createSellerRes = await fetch(`${API_BASE}/auth/create-seller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify(createSellerPayload)
    });
    const createSellerData = await createSellerRes.json();
    let sellerId = "";
    if (createSellerRes.status === 201 && createSellerData.success) {
      log(`✅ Seller profile created. Store: ${createSellerData.data.storeName}`);
      sellerId = createSellerData.data._id;
    } else {
      log(`❌ Create seller profile failed: Status ${createSellerRes.status}, Message: ${createSellerData.message}`);
    }

    // Submit KYC details
    const kycPayload = {
      panCard: "http://example.com/pan.jpg",
      addressProof: "http://example.com/address.jpg",
      livePhoto: "http://example.com/live.jpg"
    };
    const kycRes = await fetch(`${API_BASE}/auth/seller-kyc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify(kycPayload)
    });
    const kycData = await kycRes.json();
    if (kycRes.ok && kycData.success) {
      log("✅ Seller KYC submitted.");
    } else {
      log(`❌ Seller KYC submission failed: Status ${kycRes.status}, Message: ${kycData.message}`);
    }

    // Update payment details
    const paymentDetailsPayload = {
      accountHolderName: "Test Seller",
      accountNumber: "123456789012",
      ifscCode: "BARB0TESTXX",
      cancelledCheque: "http://example.com/cheque.jpg"
    };
    const bankRes = await fetch(`${API_BASE}/auth/seller-payment-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify(paymentDetailsPayload)
    });
    const bankData = await bankRes.json();
    if (bankRes.ok && bankData.success) {
      log("✅ Seller bank/payment details updated.");
    } else {
      log(`❌ Seller bank updates failed: Status ${bankRes.status}`);
    }

    // 9. ADMIN FLOWS
    log("\n--- 9. Testing Admin Endpoints & Approving Seller ---");
    
    // Admin Login
    const adminLoginRes = await fetch(`${API_BASE}/admins/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@gmail.com", password: "admin@123" })
    });
    const adminLoginData = await adminLoginRes.json();
    if (adminLoginRes.ok && adminLoginData.success) {
      adminToken = adminLoginData.data.token;
      log("✅ Admin logged in successfully.");
    } else {
      log(`❌ Admin login failed: Status ${adminLoginRes.status}, Message: ${adminLoginData.message}`);
    }

    // Verify Seller (Approve)
    if (adminToken && sellerId) {
      const verifySellerRes = await fetch(`${API_BASE}/admins/verify-seller/${sellerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: "verified" })
      });
      const verifySellerData = await verifySellerRes.json();
      if (verifySellerRes.ok && verifySellerData.success) {
        log(`✅ Admin approved seller ${sellerId}. verificationStatus: ${verifySellerData.data.verificationStatus}`);
      } else {
        log(`❌ Admin failed to approve seller: Status ${verifySellerRes.status}, Message: ${verifySellerData.message}`);
      }
    }

    // 10. SELLER PRODUCT CREATION & MGMT
    log("\n--- 10. Testing Seller Product Management (Authorized) ---");
    let sellerProductId = "";
    if (userToken && testCategory && testSubCategory) {
      
      // Dynamically build product attributes based on the allowed category attributes in categorySchemas
      const { categorySchemas } = require("../categorySchemas");
      const validFields = categorySchemas[testCategory.name] || [];
      const attributes = {};
      if (validFields.includes("brand")) attributes.brand = "Nevyra";
      if (validFields.includes("size")) attributes.size = "M";
      if (validFields.includes("color")) attributes.color = "Blue";
      if (validFields.includes("material")) attributes.material = "Silk";
      if (validFields.includes("expiryDate")) attributes.expiryDate = "2027-12-31";
      if (validFields.includes("dosage")) attributes.dosage = "500mg";
      if (validFields.includes("packSize")) attributes.packSize = "10 tablets";
      if (validFields.includes("weight")) attributes.weight = "1kg";
      if (validFields.includes("type")) attributes.type = "Organic";
      
      // Create Product
      const productPayload = {
        title: "Test Flow Silk Shirt",
        price: 1999,
        category: testCategory.name,
        subCategory: testSubCategory.name,
        images: ["http://example.com/shirt1.jpg"],
        inStock: true,
        stockQuantity: 50,
        attributes,
        additionalSpecifications: "MATERIAL: Silk; GENDER: Unisex"
      };
      
      const createProdRes = await fetch(`${API_BASE}/seller/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(productPayload)
      });
      const createProdData = await createProdRes.json();
      if (createProdRes.status === 201 && createProdData.success) {
        log(`✅ Seller created product successfully. ID: ${createProdData.data.id || createProdData.data._id}`);
        sellerProductId = createProdData.data.id || createProdData.data._id;
      } else {
        log(`❌ Seller product creation failed: Status ${createProdRes.status}, Message: ${createProdData.message}`);
      }

      // Update Product
      if (sellerProductId) {
        const updatePayload = {
          price: 2499,
          stockQuantity: 100
        };
        const updateProdRes = await fetch(`${API_BASE}/seller/products/${sellerProductId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
          },
          body: JSON.stringify(updatePayload)
        });
        const updateProdData = await updateProdRes.json();
        if (updateProdRes.ok && updateProdData.success) {
          log("✅ Seller updated product successfully.");
        } else {
          log(`❌ Seller product update failed: Status ${updateProdRes.status}`);
        }

        // Delete Product
        const delProdRes = await fetch(`${API_BASE}/seller/products/${sellerProductId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${userToken}` }
        });
        const delProdData = await delProdRes.json();
        if (delProdRes.ok && delProdData.success) {
          log("✅ Seller deleted product successfully.");
        } else {
          log(`❌ Seller product deletion failed: Status ${delProdRes.status}`);
        }
      }
    }

    // 11. GENERAL CHECKS & REPORT SUMMARY
    log("\n--- 11. Cleaning Up Database & Writing Report ---");
    
    // Clean up our temporary test data
    if (userId) {
      await User.findByIdAndDelete(userId);
      await Seller.findOneAndDelete({ user: userId });
      log("🧹 Cleaned up created test user and seller records.");
    }
    
    log("\n🎉 ALL API FLOW VERIFICATIONS COMPLETED.");
    log("A detailed report has been generated.");
    
  } catch (err) {
    logError("End-to-End API Flow Testing Script Execution", err);
  } finally {
    // Write verification report
    fs.writeFileSync(path.join(__dirname, "../../verification_report.txt"), reportText);
    await mongoose.disconnect();
    log("🔌 Database connection closed. Process exiting.");
    process.exit(0);
  }
}

run();
