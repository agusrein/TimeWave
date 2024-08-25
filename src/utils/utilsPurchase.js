
const totalPurchase = (products)=>{
    let total = 0;
    for(let i=0; i<products.length;i++){
        total += products[i].product.price * products[i].quantity;
    }
    return total;

}

const generateCode = (long)=> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < long; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}


module.exports = {generateCode, totalPurchase}