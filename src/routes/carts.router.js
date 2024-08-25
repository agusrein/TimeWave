const CartManager = require('../controllers/CartManager');
const express = require('express');
const jwtAuth = require('../middleware/jwtAuthenticate.js');
const router = express.Router();

const cartManager = new CartManager();

router.post('/carts',jwtAuth,cartManager.createCart);

router.post('/carts/:cid/products/:pid',jwtAuth, cartManager.addProductToCart);

router.delete('/carts/:cid/products/:pid', cartManager.deleteProduct);

router.delete('/carts/:cid', cartManager.emptyCart);

router.put('/carts/:cid/products/:pid', cartManager.updateQuantity);

router.put('/carts/:cid', cartManager.updateCart);

router.get('/carts/:cid', cartManager.renderCart);

router.get('/carts/:cid', cartManager.getProductsByCart);

router.put('/carts/:cid/purchase',jwtAuth, cartManager.confirmPurchase);


module.exports = router;