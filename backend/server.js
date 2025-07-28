require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/mongodb");

const app = express();

// Configure CORS to allow requests from frontend
const corsOptions = {
  origin: [
    'https://nevback.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://nevyra-frontend.vercel.app', // Add your deployed frontend URL if you have one
    'https://nevyra.vercel.app', // Add your deployed frontend URL if you have one
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logger middleware (optional)
const logger = require("./middlewares/logger");
app.use(logger);

// Register API routes
app.use("/api", routes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
