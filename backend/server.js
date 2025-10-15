require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/mongodb");

const app = express();

// Configure CORS to allow requests from frontend
const corsOptions = {
  origin: [
    'https://nevyraadmin.onrender.com',
    'https://nevyrafron.onrender.com',
    'https://nevyrafron.onrender.com',
    'https://nevyrafrontend.onrender.com',
    'https://nevyra.onrender.com',
    'http://localhost:8080', 
    'http://localhost:8081',// Your frontend development server
    'http://localhost:3000',
    'http://localhost:5173',
    'https://nevyraback.onrender.com', // Your new backend URL
    'https://nevfront.onrender.com', // Your previous deployed frontend URL
    'https://nevyrafront.onrender.com', // Your new deployed frontend URL
    'https://nevyraui.onrender.com', // Your latest deployed frontend URL
    'https://nevyra-frontend.vercel.app', // Alternative deployed frontend URL
    'https://nevyra.vercel.app', // Alternative deployed frontend URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Logger middleware (optional)
const logger = require("./middlewares/logger");
app.use(logger);

// Parse JSON and URL-encoded bodies BEFORE routes (needed for /products, etc.)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Register API routes
app.use("/api", routes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
