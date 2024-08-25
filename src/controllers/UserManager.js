const passport = require('passport');
const jwt = require('jsonwebtoken');
const { COOKIETOKEN, JWTKEY } = require('../config/config.js');
const { userServices } = require('../services/index.js')

class UserManager {

    async register(req, res, next) {
        passport.authenticate("register", async (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(400).render("register", { message: info.message });
            }
            const token = jwt.sign({ user }, JWTKEY, { expiresIn: '1d' })
            res.cookie(COOKIETOKEN, token, {
                httpOnly: true,
                mxAge: 3600000
            })
            res.redirect('/products'); //CURRENT
        })(req, res, next);
    };

    async login(req, res, next) {
        passport.authenticate('login', async (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(400).render('login', { message: info.message });
            }
            const token = jwt.sign({ user }, JWTKEY, { expiresIn: '1d' })
            res.cookie(COOKIETOKEN, token, {
                httpOnly: true,
                mxAge: 3600000
            })
            // return res.status(200).json({token})
            return res.redirect("/products"); //CURRENT
        })(req, res, next);
    }

    async logout(req, res) {
        const token = req.cookies[COOKIETOKEN];
        if (token) {
            res.clearCookie(COOKIETOKEN);
            return res.redirect("/login");
        } else {
            return res.redirect("/login");
        }
    }


    async requestPasswordReset(req, res) {
        const { email } = req.body;
        try {
            const result = await userServices.requestPasswordReset(email)
            if (result.status) {
                return res.status(200).render('resetpassword', { message: result.message })
            }
            else {
                return res.status(404).render('resetpassword', { error: result.message })
            }

        } catch (error) {
            return res.status(500).send({ message: error.message });

        }

    }

    async resetPassword(req, res) {
        const { email, pass, token } = req.body;
        try {
            const result = await userServices.resetPassword(email, pass, token)
            if (result.status) {
                return res.status(200).render('changepassword', { success: result.message })
            }
            else if (!result.status && result.code == 1) {
                return res.status(404).render('changepassword', { error: result.message })
            }
            else if (!result.status && result.code == 2) {
                return res.status(404).render('changepassword', { error: result.message })
            }
            else if (!result.status && result.code == 3) {
                return res.status(404).render('changepassword', { error: result.message, message: 'Reenvíar nuevamente un código de restablecimiento' })
            }
            else if (!result.status && result.code == 4) {
                return res.status(404).render('changepassword', { error: result.message })
            }


        } catch (error) {
            return res.status(500).send({ message: error.message });

        }
    }



    async changePremiumRol(req, res) {
        const { uid } = req.params;
        try {
            const result = await userServices.changePremiumRol(uid)
            if (result.status) {
                return res.status(200).send({ message: result.message })
            }
            else {
                return res.status(404).send({ message: result.message })
            }
        } catch (error) {
            return res.status(500).send({ message: error.message });

        }

    }
    async uploadFiles(req, res) {
        const { uid } = req.params;
        const uploadedDocuments = req.files;
        try {
            const result = await userServices.uploadFiles(uid,uploadedDocuments)
            if (result.status) {
                return res.status(200).send({ message: result.message })
            }
            else {
                return res.status(404).send({ message: result.message })
            }
        } catch (error) {
            return res.status(500).send({ message: error.message });

        }
    }
}

module.exports = UserManager;