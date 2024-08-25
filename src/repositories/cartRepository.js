const CartModel = require('../models/carts.model.js');
const UserModel = require('../models/user.model.js');
const TicketModel = require('../models/tickets.model.js');
const ProductModel = require('../models/products.model.js');
const {totalPurchase,generateCode} = require('../utils/utilsPurchase.js')

class CartRepository {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return { status: true, message: `Carrito Creado`, cart: newCart }

        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }

    }

    async getProductsByCart(id) {
        try {
            const cartFound = await CartModel.findById(id);
            if (cartFound) {
                return { status: true, message: 'Carrito encontrado:', cart: cartFound };
            }
            return { status: false, message: `ERROR Not Found : ${id}` }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
    }

    async addProductToCart(user,id, productId, quantity) {
        try {
            const product = await ProductModel.findById(productId)
            const cartFound = await CartModel.findById(id);
            if (user.role === 'premium' && product.owner.toString() === user._id.toString()) {
                return { status: false, message: 'No puedes agregar tu propio producto al carrito.' };
            }
            else if (cartFound) {
                const existingProduct = cartFound.products.find(e => e.product._id.toString() == productId);
                existingProduct ? existingProduct.quantity += quantity : cartFound.products.push({ product: productId, quantity });
                cartFound.markModified("products");
                await cartFound.save();
                return { status: true, message: 'Producto Agregado', cart: cartFound.products}
            }
            else {
                return { status: false, message: `ERROR Not Found : ${id}` }
            }
        }
        catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }

    }

    async updateQuantity(id, productId, quantity = 1) {
        try {
            const cartFound = await CartModel.findById(id);
            if (cartFound) {
                const existingProduct = cartFound.products.find(e => e.product.toString() == productId);
                if (existingProduct) {
                    existingProduct.quantity += quantity;
                    await cartFound.save();
                    return { status: true, message: 'Producto Agregado' }
                }
                return { status: false, message: 'Producto no encontrado' }
            }

            return { status: false, message: `ERROR Not Found : ${id}` }

        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
    }

    async deleteProduct(id, productId, quantity = 1) {
        try {
            const cartFound = await CartModel.findById(id);
            if (cartFound) {
                const existingProduct = cartFound.products.find(e => e.product._id.toString() == productId);
                const existingProductIndex = cartFound.products.findIndex(e => e.product._id.toString() == productId);
                if (existingProduct) {
                    existingProduct.quantity -= quantity;
                    if (existingProduct.quantity == 0) {
                        cartFound.products.splice(existingProductIndex, 1)
                    }
                    cartFound.markModified("products");
                    await cartFound.save();
                    return { status: true, message: 'Producto Eliminado' }
                } else {
                    return { status: false, message: `ERROR Not Found : ${productId}` }
                }
            }
            else {
                return { status: false, message: `ERROR Not Found : ${id}` }
            }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }

    }

    async emptyCart(id) {
        try {
            const cartFound = await CartModel.findById(id);
            if (cartFound) {
                cartFound.products = []
                // cartFound.__v = 0;
                await cartFound.save();
                return { status: true, message: 'Carrito Eliminado:', cart : cartFound.products };
            }
            return { status: false, message: `ERROR Not Found : ${id}` }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
    }

    async updateCart(id, data) {
        try {
            const cartFound = await CartModel.findById(id);
            if (cartFound) {
                cartFound.products = data;
                return { status: true, message: 'Formato Actualizado' };
            }
            return { status: false, message: `ERROR Not Found : ${id}` }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }

    }

    async confirmPurchase(cart, products) {
        try {
            const cartUser = await UserModel.findOne({ cart: cart._id });
            const notAvailable = [];
            for (let e of products) {
                if (e.product.stock < e.quantity) {
                    notAvailable.push(e.product);
                    return { status: false, message: `No hay suficiente stock del producto ${e.product.title} para realizar la compra`, notAvailable }
                } else {
                    e.product.stock -= e.quantity;
                    await e.product.save();
                    
                }
                const ticket = new TicketModel({
                    code: generateCode(8),
                    purchase_datetime: new Date(),
                    amount: totalPurchase(products),
                    purchase: cartUser._id
                })

                await ticket.save();
                cart.products = cart.products.filter(e => notAvailable.some(id => id.equals(e.product)));
                await cart.save();

                return{status: true, message:`Detalle de compra`, ticket: ticket}
            }


        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }

    }




}
module.exports = CartRepository;