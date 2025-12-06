const jwt = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {
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
        req.user = decoded; // Attach user info to request
        return next();
    } catch (error) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;
