const socket = io();


document.querySelectorAll('.user__table').forEach(table => {
    const userId = table.querySelector('.uid').textContent.trim();
    const first_name = table.querySelector('.first_name').textContent;
    const last_name = table.querySelector('.last_name').textContent;
    table.querySelector('.btn__deleteUser').addEventListener('click', () => {
        socket.emit('deleteUser', userId);


        socket.on('userDeleted', (res) => {
            if (res.status) {
                alert(res.message);
                table.remove();
            } else {
                alert('Error: ' + res.message);
            }
        });
    });

    table.querySelector('.btn__changeRol').addEventListener('click', () => {
        socket.emit('changeRol', userId);

        socket.on('rolChanged', (res) => {
            if (res.status === 'success') {
                location.reload();
            } else if (res.status === 'uploadDocuments') {
                const container = table.querySelector('.div__container--formUploads')
                container.innerHTML = `
                <form class=" d-flex flex-column m-3 p-3 border rounded-2 col-7 uploadForm" action="/api/${userId}/documents" method="POST" enctype="multipart/form-data">
                <div class="d-flex">
                <h6 class="col-11 m-0 align-self-center">Para el cambio de rol del usuario ${first_name} ${last_name} adjunte la siguiente información :</h6>
                <button class="col-1 rounded-pill btn btn-danger btn__close">X</button>
                </div>

                    <div class="col-12 d-flex mt-3">
                        <label class="col-8" for="identificacion">1 - Identificación:</label>
                        <input class="col-4" type="file" name="documents" value="identificacion" required>
                    </div>
                    <div class="col-12 d-flex mt-3">
                        <label class="col-8" for="comprobante_domicilio">2 - Comprobante de domicilio:</label>
                        <input class="col-4" type="file" name="documents" value="comprobante_domicilio" required>
                    </div>
                    <div class="col-12 d-flex mt-3">
                        <label class="col-8" for="comprobante_estado_cuenta">3 - Comprobante de estado de cuenta:</label>
                        <input class="col-4" type="file" name="documents" value="comprobante_estado_cuenta" required>
                    </div>
                    <button class="mt-3" type="submit">Subir Documentos</button>
                </form>
            `;
                table.querySelector('.btn__close').addEventListener('click', (e) => {
                    e.preventDefault();
                    container.innerHTML = ``;
                })
            } else {
                alert('Error : ' + res.message);
            }



            document.querySelector('.uploadForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    const formData = new FormData(e.target);

                    const response = await fetch(`/api/${userId}/documents`, {

                        method: 'POST',
                        body: formData,
                    })
                    const data = await response.json()
                    console.log(data)
                    if (data.status) {
                        alert(data.message);
                        location.reload();
                    } else {
                        alert('Error: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        });
    })

});






