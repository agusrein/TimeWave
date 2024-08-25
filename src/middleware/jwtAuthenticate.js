const passport = require('passport');
const UserDTO = require('../dto/user.dto.js');

const jwtAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.user = new UserDTO(user.user);
        next();
    })(req, res, next);
};

module.exports = jwtAuth;