const { productServices } = require('../services/index.js')
const createProducts = require('../utils/utils.js')

class ProductManager {

    async getProducts(request, response) {
        try {
            let page = parseInt(request.query.page);
            let limit = parseInt(request.query.limit);
            let query = request.query.category;
            let sort = parseInt(request.query.sort);

            const products = await productServices.getProducts({ page, limit, query, sort });
            return response.status(200).send(
                {
                    status: 'success',
                    payload: products.docs,
                    totalPages: products.totalPages,
                    prevPage: products.prevPage,
                    nextPage: products.nextPage,
                    page: products.page,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
                    nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
                }
            );
        }
        catch (error) {
            response.status(500).send({ message: error.message });
        }
    };

    async getProductsById(request, response) {
        try {
            let id = request.params.pid;
            let product = await productServices.getProductById(id);
            product.status ? response.status(200).send({ message: product.message, product: product.product }) : response.status(404).send({ message: product.message })

        }
        catch(error) {
            response.status(500).send({ message: error.message });
        }
    }

    async addProduct(request, response) {
        const user = request.user;
        const { title, description, price, thumbnail, code, stock, status, img, category, owner } = request.body;
        try {
            const result = await productServices.addProduct(user,title, description, price, thumbnail, code, stock, status, img, category, owner);
            result.status ? response.status(200).send({ message: result.message }) : response.status(404).send(result)
        } catch (error) {
            response.status(500).send({ message: `ARTICULO NO AGREGADO: ${error.message}` });
        }
    }

    async updateProduct(request, response) {
        const user = request.user;
        let id = request.params.pid;
        const { property, value } = request.body;
        try {
            const result = await productServices.updateProduct(user,id, { property, value });
            result.status ? response.status(200).send({ message: result.message }) : response.status(404).send({ message: result.message })
        } catch (error) {
            response.status(500).send({ message: `ERROR AL ACTUALIZAR EL PRODUCTO: ${error.message}` });
        }
    }

    async deleteProduct(request, response) {
        const user = request.user;
        let id = request.params.pid;
        try {
            const result = await productServices.deleteProduct(user,id);
            result.status ? response.status(200).send({ message: result.message }) : response.status(404).send({ message: result.message })

        } catch (error) {
            response.status(500).send({ message: `ERROR AL ELIMINAR EL PRODUCTO: ${error.message}` })
        }
    }

    async renderProducts(request,response){
        try {
            let page = parseInt(request.query.page) || 1;
            let limit = parseInt(request.query.limit) || 10;
            let query = request.query.category || null;
            let sort = parseInt(request.query.sort) || 1;
            const products = await productServices.getProducts({ page, limit, query, sort });
    
            const finalProducts = products.docs.map(e => {
                const { _id, ...rest } = e.toObject();
                return rest;
            })
            
            response.render('home', {
                user: request.user,
                products: finalProducts,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                currentPage: products.page,
                totalPages: products.totalPages,
                prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
            });
        } catch (error) {
            response.status(500).send({ message: error.message });
        }
    }

    async createProducts(request,response){
        const products = [];
        try {
            for(let i=0; i<100;i++){
                products.push(createProducts())
            }
            return response.status(200).send({message: 'Productos Creados', products})
        } catch (error) {
            response.status(500).send({ message:  error});
        }
        
    }
}


module.exports = ProductManager;