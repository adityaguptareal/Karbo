 function isCompany(req, res, next) {
    if (req.user.role === 'company') {
        next();
    } else {
        return res.status(403).json({ msg: "Access denied: Company only" });
    }
}
module.exports = isCompany;