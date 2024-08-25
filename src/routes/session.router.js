
const express = require('express');
const router = express.Router();
const UserManager = require('../controllers/UserManager.js');
const userManager = new UserManager();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { COOKIETOKEN, JWTKEY } = require('../config/config.js');


router.get('/logout', userManager.logout)
router.post('/login', userManager.login)

router.get('/github',passport.authenticate('github',{scope: ["user:email"]}),async (req,res)=>{})

router.get('/sessions/githubcallback', passport.authenticate('github',{
    failureRedirect : '/login',
    session: false 
}),async(req,res)=>{
    const user = req.user;
    const token = jwt.sign({user},JWTKEY,{expiresIn:'1d'})
        res.cookie(COOKIETOKEN,token,{
            httpOnly:true,
            mxAge: 3600000
        })
    res.redirect('/products') // CURRENT
})



module.exports = router;