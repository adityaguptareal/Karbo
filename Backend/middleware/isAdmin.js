const { is } = require("zod/v4/locales");

function isAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ msg: "Access denied: Amdin only" });
    }
}
module.exports = isAdmin;