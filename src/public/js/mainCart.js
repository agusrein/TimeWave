
const cartId = document.getElementById('btn__confirmPurchase').getAttribute('data-cart-id')

const btnConfirm = document.getElementById('btn__confirmPurchase')
if (btnConfirm) {
    btnConfirm.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/carts/${cartId}/purchase`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Compra confirmada:', result);
                alert(`Compra confirmada exitosamente su ticket de compra : ${result.ticket.code}`);
                location.reload();
            } else {
                console.error('Error al confirmar la compra:', result.message);
                alert('Error al confirmar la compra: ' + result.message);
            }
        } catch (error) {
            alert('Error al confirmar la compra: ' + error);
        }
    })
}


const btnEmpty = document.getElementById('btn__emptyCart')
if (btnEmpty) {
    btnEmpty.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                alert('El carrito ha sido vaciado con éxito.');
                location.reload();
            } else {
                alert('Error al vaciar el carrito: ' + result.message);
            }
        } catch (error) {
            alert('Error al vaciar el carrito: ' + error.message);
        }

    })
}
const containers = document.querySelectorAll('.div__container--cart').forEach(container => {
    const productId = container.getAttribute('data-product-id');
    const btnDelete = container.querySelector('.btn__delete');
    const btnAdd = container.querySelector('.add__product');
    const quantity = 1;

    if (btnDelete && btnAdd) {
        btnDelete.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();

                if (response.ok) {
                    alert('Producto eliminado con éxito.');
                    location.reload();
                } else {
                    alert('Error al eliminar el producto: ' + result.message);
                }
            } catch (error) {
                alert('Error al eliminar el producto: ' + error.message);
            }
        });

        btnAdd.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity })
                });
                const result = await response.json();

                if (response.ok) {
                    alert('Producto agregado.');
                    location.reload();
                } else {
                    alert('Error al agregar el producto: ' + result.message);
                }
            } catch (error) {
                alert('Error al agregar el producto: ' + error.message);
            }
        })
    }
})


