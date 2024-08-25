const socket = require('socket.io');
const MessageModel = require('../models/messages.model.js');
// const productManager = require('../controllers/ProductManager.js');
// const ProductManager = new productManager();
const { productServices } = require('../services/index.js')

class SocketManager { 
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.init();
    }

    async init() {
        this.io.on("connection", async (socket) => {
            console.log('usuario conectado');

            // socket.on("message", async data => {
            //     await MessageModel.create(data);

            //     const messages = await MessageModel.find();
            //     this.io.sockets.emit("message", messages);
            // })

            try {
                const products = await productServices.getProducts();
                socket.emit("products", products.docs);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }

            socket.on("deleteProduct", async (id) => {
                await productServices.deleteProduct(id);
                const products = await productServices.getProducts()
                socket.emit("products", products.docs);
            })
            socket.on("addProduct", async (product) => {
                const result = await productServices.addProduct(
                    product.title,
                    product.description,
                    product.price,
                    product.thumbnail,
                    product.code,
                    product.stock,
                    product.status,
                    product.img,
                    product.category

                );
                if (result.status) {
                    console.log(result);
                    const products = await productServices.getProducts()
                    socket.emit('products', products.docs );
                } else {
                    console.log(result);
                    
                }
            })
        })
    }
}

module.exports = SocketManager;