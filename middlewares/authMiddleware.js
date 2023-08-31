const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY).user;
    const user = await User.findById( decoded );
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = {
  verifyToken,
};
