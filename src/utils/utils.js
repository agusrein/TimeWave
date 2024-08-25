const {faker} = require('@faker-js/faker');

const createProducts = ()=>{
    const categories = ['Entrantes', 'Platos Principales', 'Postres', 'Bebidas']
    const status_options = ['Disponible', 'Agotado']
    return{
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.finance.amount({ min: 5, max: 10, dec: 2, symbol: '$' }),
        thumbnail: faker.image.url(200, 200, 'food', true),
        code: faker.string.alphanumeric(10),
        stock: faker.number.int({ min: 0, max: 100 }),
        status: faker.helpers.arrayElement(status_options),
        img: faker.image.url(800, 600, true),
        category: faker.helpers.arrayElement(categories)
    }
}

module.exports = createProducts;