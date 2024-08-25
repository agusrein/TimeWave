const generateUndefinedTypeError = (data) =>{
    return`Datos Requeridos para completar la Operación :
        -TITULO: Se esperaba obtener el título (String) del producto, el dato obtenido es ${data.title} 
        -DESCRIPCIÓN: Se esperaba obtener la descripción (String) del producto, el dato obtenido es ${data.description} 
        -PRECIO: Se esperaba obtener el precio (Number) del producto, el dato obtenido es ${data.price} 
        -STOCK: Se esperaba obtener la cantidad de unidades (Number) del producto, el dato obtenido es ${data.stock} 
        -CATEGORIA: Se esperaba obtener el numero de categoria (String) perteneciente del producto, el dato obtenido es ${data.category}` 
}


module.exports = generateUndefinedTypeError;