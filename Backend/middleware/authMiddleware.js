const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/userModel");

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: "Authorization header missing" });
    }

    let token = authHeader;

    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user exists and is not blocked
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ msg: "Your account has been blocked. Please contact support." });
        }

        req.user = decoded; // Attach user info to request
        return next();
    } catch (error) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;
