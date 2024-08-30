const socket = require('socket.io');
// const MessageModel = require('../models/messages.model.js');
const { productServices, userServices } = require('../services/index.js')

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

            socket.on("refreshProducts", async () => {
                try {
                    const products = await productServices.getProducts();
                    socket.emit("products", products.docs);
                } catch (error) {
                    console.log('Error al obtener productos:', error);
                }
            })
            

            socket.on('deleteUser', async (uid) => {
                try {
                    const result = await userServices.deleteUser(uid);
                    if (result.status) {
                        socket.emit('userDeleted', { status: 'success', message: result.message });
                    } else {
                        socket.emit('userDeleted', { status: 'error', message: result.message });
                    }
                } catch (error) {
                    socket.emit('userDeleted', { status: 'error', message: result.message });
                }
            });

            socket.on('changeRol', async (uid) => {
                try {
                    const result = await userServices.changePremiumRol(uid);
                    if (result.status) {
                        socket.emit('rolChanged', { status: 'success', message: result.message });
                    } else if (result.code = 1) {
                        socket.emit('rolChanged', { status: 'uploadDocuments', message: result.message });
                    } else {
                        socket.emit('rolChanged', { status: 'error', message: result.message });
                    }
                } catch (error) {
                    socket.emit('rolChanged', { status: 'error', message: 'Error en el servidor' });
                }
            });
            
        })
    }
}

module.exports = SocketManager;