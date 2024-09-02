document.querySelectorAll('.btn__addToCart').forEach(btn => {
    btn.addEventListener('click', async (e)=>{
            const productId = e.target.dataset.productId;  
            const cartId = e.target.dataset.userCart;  

            
            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
    
                const result = await response.json();
                if (response.ok) {
                    console.log('Producto agregado al carrito:', result.message);
                } else {
                    console.error('Error al agregar producto al carrito:', result.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        })
})
    