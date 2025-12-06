function isFarmer(req, res, next) {
    if (req.user.role === 'farmer') {
        next();
    } else {
        return res.status(403).json({ msg: "Access denied: Farmers only" });
    }
}
module.exports = isFarmer;