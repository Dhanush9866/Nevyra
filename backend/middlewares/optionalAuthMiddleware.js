const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretToken");
    req.user = decoded;
    next();
  } catch (err) {
    // Token valid key verification failed or token expired
    // Proceed without user (guest mode) but NOT erroring out
    // console.warn("Optional auth token failed:", err.message);
    next();
  }
};
