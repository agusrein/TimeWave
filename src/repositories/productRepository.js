const ProductModel = require('../models/products.model.js');
const UserModel = require('../models/user.model.js');
const customError = require('../services/errors/customErrors.js');
const Errors = require('../services/errors/enum.js');
const generateUndefinedTypeError = require('../services/errors/info.js');

class ProductRepository {
    async addProduct(user, title, description, price, thumbnail = [], code, stock, status = true, img = "", category, owner) {
        const product = { title, description, price, thumbnail, code, stock, status, img, category, owner };
        const existingProduct = await ProductModel.findOne({ code: code });
        try {
            if (existingProduct) {
                return { status: false, message: `El producto con el código ${product.code} ya existe.` }

            } else if (!product.title || !product.description || !product.price || !product.stock || !product.category) {
                throw customError.createError({
                    name: 'Nuevo Producto',
                    cause: generateUndefinedTypeError(product),
                    message: 'Error en el ingreso de datos',
                    code: Errors.UNDEFINED_DATA
                })
            }
            else {
                if (user.role == 'premium') {
                    product.owner = user._id;
                }
                else {
                    const userAdmin = await UserModel.findOne({ role: 'admin' })
                    product.owner = userAdmin._id;
                }
                const newProduct = ProductModel({ ...product })
                await newProduct.save();
                return { status: true, message: 'PRODUCTO AGREGADO EXITOSAMENTE' };
            }
        } catch (error) {
            return {
                status: false,
                message: error.message,
                name: error.name,
                code: error.code,
                cause: error.cause
            };
        }
    }

    async getProducts({ page = 1, limit = 10, query = null, sort = 1 } = {}) {
        try {
            let products;
            sort > 0 ? 1 : -1 //Ascendente o Descendente s/ numeración.
            if (query) {
                products = await ProductModel.paginate({ category: { $eq: query } }, { limit, page, sort: { price: sort } })
                return products;
            }
            else if (!page && !limit && !query && !sort) {
                products = await ProductModel.find().lean();
                return products;
            }
            else {
                products = await ProductModel.paginate({}, { limit, page, sort: { price: sort } })
                return products;
            }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` };
        }
    }

    async getProductById(id) {
        try {
            const productFound = await ProductModel.findById(id);
            if (productFound) {
                return { status: true, message: `Producto ${id} encontrado :`, product: productFound };
            }
            else {
                return { status: false, message: `Product Not Found : (${id})` }
            }
        }
        catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
    }

    async updateProduct(user, id, { property, value }) {
        try {
            const product = await ProductModel.findOne({ _id: id });
            if (product) {
                //Corroboro que la propiedad que se pasa como parámetro se encuentre y no se me agregue al objeto como una nueva
                if (property in product) {
                    if (user.role === 'admin' || (user.role === 'premium' && product.owner.toString() === user._id.toString())) {
                        product[property] = value;
                        await product.save();
                        return { status: true, message: `La propiedad ${property} del producto ${id} se ha modificado correctamente.` };
                    } else { return { status: false, message: `No cuentas con autorización para modificar este producto.` }; }

                } else {
                    return { status: false, message: `La propiedad ${property} no existe en el producto ${id}. No se ha modificado.` };
                }
            } else {
                return { status: false, message: `Product Not Found : (${id})` }
            }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` };
        }
    }

    async deleteProduct(user, id) {
        try {
            const productToDelete = await ProductModel.findById(id)
            if (!productToDelete) {
                return { status: false, message: `Product Not Found : (${id})` }
            }
            if (user.role === 'admin' || (user.role === 'premium' && productToDelete.owner.toString() === user._id.toString())) {
                await ProductModel.findByIdAndDelete(id);
                return { status: true, message: `El producto ${id} se ha eliminado.` };
            }
            return { status: false, message: 'No tienes permisos para eliminar este producto.' };
        }
        catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
    }
}

module.exports = ProductRepository;