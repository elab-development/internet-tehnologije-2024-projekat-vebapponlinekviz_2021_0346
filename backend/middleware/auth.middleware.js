const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token nije prosleđen" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Korisnik ne postoji" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Nevažeći token" });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return res.status(403).json({ message: "Zabranjen pristup. Nisi admin." });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };