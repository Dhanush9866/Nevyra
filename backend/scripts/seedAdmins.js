const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://hosannaking2019:YWafeOL8X8dkaSYn@cluster0.rdtscmx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Default admin data
const defaultAdmins = [
  {
    firstName: "Super",
    lastName: "Admin",
    email: "admin@gmail.com",
    phone: "+1234567890",
    password: "admin@123"
  }
];

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

async function seedAdmins(adminData = defaultAdmins) {
  try {
    console.log("🌱 Starting admin seeding process...");
    
    const results = {
      created: 0,
      skipped: 0,
      errors: 0
    };

    for (const adminInfo of adminData) {
      try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: adminInfo.email });
        
        if (existingAdmin) {
          console.log(`⚠️  Admin already exists: ${adminInfo.email}`);
          results.skipped++;
          continue;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminInfo.password, 12);
        
        // Create new admin
        const newAdmin = new Admin({
          firstName: adminInfo.firstName,
          lastName: adminInfo.lastName,
          email: adminInfo.email,
          phone: adminInfo.phone,
          password: hashedPassword
        });

        await newAdmin.save();
        console.log(`✅ Admin created successfully: ${adminInfo.email}`);
        results.created++;
        
      } catch (error) {
        console.error(`❌ Error creating admin ${adminInfo.email}:`, error.message);
        results.errors++;
      }
    }

    // Display summary
    console.log("\n📊 Seeding Summary:");
    console.log(`   Created: ${results.created}`);
    console.log(`   Skipped: ${results.skipped}`);
    console.log(`   Errors: ${results.errors}`);
    
    if (results.created > 0) {
      console.log("\n🔑 Default Admin Credentials:");
      adminData.forEach(admin => {
        console.log(`   Email: ${admin.email}`);
        console.log(`   Password: ${admin.password}`);
        console.log("   ---");
      });
    }

  } catch (error) {
    console.error("❌ Seeding process failed:", error.message);
    throw error;
  }
}

async function clearAdmins() {
  try {
    console.log("🗑️  Clearing all admins...");
    const result = await Admin.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} admin(s)`);
  } catch (error) {
    console.error("❌ Error clearing admins:", error.message);
    throw error;
  }
}

async function listAdmins() {
  try {
    console.log("📋 Current admins in database:");
    const admins = await Admin.find({}, { password: 0 }); // Exclude password from output
    
    if (admins.length === 0) {
      console.log("   No admins found");
    } else {
      admins.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.firstName} ${admin.lastName} (${admin.email})`);
      });
    }
  } catch (error) {
    console.error("❌ Error listing admins:", error.message);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    await connectToDatabase();

    switch (command) {
      case 'clear':
        await clearAdmins();
        break;
      case 'list':
        await listAdmins();
        break;
      case 'seed':
      default:
        await seedAdmins();
        break;
    }

  } catch (error) {
    console.error("❌ Script execution failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Handle custom admin data via environment variables or command line
if (process.env.ADMIN_DATA) {
  try {
    const customAdmins = JSON.parse(process.env.ADMIN_DATA);
    if (Array.isArray(customAdmins)) {
      defaultAdmins.splice(0, defaultAdmins.length, ...customAdmins);
    }
  } catch (error) {
    console.warn("⚠️  Invalid ADMIN_DATA environment variable, using default admins");
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  seedAdmins,
  clearAdmins,
  listAdmins,
  connectToDatabase
};
