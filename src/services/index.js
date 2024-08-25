const ProductRepository = require('../repositories/productRepository.js');
const CartRepository = require('../repositories/cartRepository.js');
const UserRepository = require('../repositories/userRepository.js');

const productServices = new ProductRepository();
const cartServices = new CartRepository();
const userServices = new UserRepository();

module.exports = {productServices, cartServices, userServices}; 