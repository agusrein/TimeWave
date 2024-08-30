const socket = io();

socket.on('products', (data) => {
    renderProducts(data);
});


const renderProducts = (products) => {
    const container = document.getElementById('div__container--products');
    container.innerHTML = "";
    products.forEach(e => {
        const card = document.createElement("div");
        card.innerHTML = `
        
        <div class="card col-12 m-3">
                <div class="card-body">
                <h5 class="card-title text-center">${e.title}</h5>
                <div class="d-flex justify-content-evenly">
                <p class="card-text">ID: ${e._id}</p>
                <p>$ ${e.price}</p>
                </div>
                <button class="rounded-2 col-11 btn btn-danger">Eliminar</button>
            </div>
        </div>
        
        `
        container.appendChild(card);
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(e._id)
        })
    });

}

const deleteProduct = async (id) => {
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            console.log( result.message);
            socket.emit('refreshProducts'); 
        } else {
            console.error('Error al eliminar el producto:', result.message);
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert(`Error en la solicitud: ${error.message}`);
    }
};


document.getElementById('btn__AddProduct').addEventListener('click', (e) => {
    e.preventDefault();
    addProduct();
})


const addProduct = async () => {
    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('img').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        status: document.getElementById('status').value === "true",
        img: "",
        category: document.getElementById('category').value,
    };

    const resetForm = () => {
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('price').value = '';
        document.getElementById('img').value = '';
        document.getElementById('code').value = '';
        document.getElementById('stock').value = '';
        document.getElementById('status').value = '';
        document.getElementById('category').value = '';
    }

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        const result = await response.json();
        if (response.ok) {
            console.log(result.message);
            socket.emit('refreshProducts');
            resetForm();

        } else {
            console.log('Error al agregar producto:', result.message);
        }
    } catch (error) {
        console.log('Error en la solicitud:', error);
    }
}
