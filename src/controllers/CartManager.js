const { cartServices } = require('../services/index.js');

class CartManager { 

    async createCart(request, response) {
        try {
            let result = await cartServices.createCart();
            if (result.status) {
                response.status(200).send({ message: result.message, cart: result.cart });
            } else {
                response.status(500).send({ message: 'No se pudo crear el carrito' });
            }
        } catch (error) {
            response.status(500).send({ message: `Error al crear el carrito:   ${error.message}` });
        }
    }

    async getProductsByCart(request, response) {
        const id = request.params.cid;
        try {
            const cart = await cartServices.getProductsByCart(id);
            cart.status ? response.status(200).send({ message: cart.message, cart: cart.cart }) : response.status(404).send({ message: cart.message });

        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async addProductToCart(request, response) {
        const pid = request.params.pid;
        const cid = request.params.cid;
        const quantity = request.body.quantity;
        const user = request.user;
        try {
            const updateCart = await cartServices.addProductToCart(user,cid, pid, quantity);
            updateCart.status ? response.status(200).send({ message: updateCart.message, cart: updateCart.cart }) : response.status(404).send({ message: updateCart.message })

        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async deleteProduct(request, response) {
        const pid = request.params.pid;
        const cid = request.params.cid;
        let quantity;
        
        try {
            const productDelete = await cartServices.deleteProduct(cid, pid, quantity);
            if (productDelete.status) {
                return response.status(200).send({ message: productDelete.message })
            }
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async emptyCart(request, response) {
        const cid = request.params.cid;
        try {
            const emptyCart = await cartServices.emptyCart(cid)
            emptyCart.status ? response.status(200).send({ message: emptyCart.message, cart: emptyCart.cart }) : response.status(404).send({ message: emptyCart.message });
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async updateQuantity(request, response) {
        const pid = request.params.pid;
        const cid = request.params.cid;
        let quantity;
        try {
            const updateQuantity = await cartServices.updateQuantity(cid, pid, quantity)
            updateQuantity.status ? response.status(200).send({ message: updateQuantity.message }) : response.status(404).send({ message: updateQuantity.message });
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async updateCart(request, response) {
        const cid = request.params.cid;
        const data = request.body;
        try {
            const newFormat = await cartServices.updateCart(cid, data)
            newFormat.status ? response.status(200).send({ message: newFormat.message }) : response.status(404).send({ message: newFormat.message })
        } catch (error) {
            response.status(500).send(error.message);
        }
    }

    async renderCart(request, response) {
        try {
            const cid = request.params.cid;
            const cart = await cartServices.getProductsByCart(cid);
            if (cart.status) {
                const products = cart.cart.products.map(e => ({
                    product: e.product.toObject(),
                    quantity: e.quantity
                }));
                response.render('carts', { cart: products })
            }
            else { response.status(404).send({ message: cart.message }); }

        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    }

    async confirmPurchase(request, response) {
        const cid = request.params.cid;
        try {
            const cart = await cartServices.getProductsByCart(cid);
            if (cart.status) {
                const products = cart.cart.products;
                const result = await cartServices.confirmPurchase(cart.cart, products);
                return response.status(result.status ? 200 : 400).send(result);
            }
            return response.status(404).send({ message: cart.message })
        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    }
}

module.exports = CartManager;