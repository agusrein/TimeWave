const roleCheck = (roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            req.unauthorized = true;
            res.render('unauthorized')
            next();
        }
    };
};

module.exports = roleCheck;