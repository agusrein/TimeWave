const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/ProductManager');
const productsManager = new ProductManager();
const CartManager = require('../controllers/CartManager');
const cartManager = new CartManager();
const jwtAuth = require('../middleware/jwtAuthenticate.js');
const roleCheck = require('../middleware/checkrole.js');

router.get('/products',jwtAuth, productsManager.renderProducts)


router.get("/realtimeproducts",jwtAuth,roleCheck(['admin', 'premium']), (request, response) => {
    try {
        if(request.unauthorized){
           return response.render('unauthorized');
        }
        return response.render('realtimeproducts');
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
});

router.get("/chat",jwtAuth,roleCheck('user'), async (req, res) => {
    try {
         return res.render("messages", {user: req.user});
    } catch (error) {
        return res.send(error)
    }
    
})

router.get("/carts/:cid", cartManager.renderCart)

router.get("/login", (req,res) =>{
res.render("login")
})

router.get("/register", (req,res) =>{
    res.render("register")
})

router.get("/profile", jwtAuth, (req, res) => {
    return res.render("profile", { user: req.user});
});

router.get('/reset-password', (req,res)=>{
    return res.render('resetpassword')
})

router.get("/change-password", (req,res)=>{
    return res.render('changepassword');
})




module.exports = router;