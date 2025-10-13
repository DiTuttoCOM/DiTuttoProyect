document.addEventListener('DOMContentLoaded', function() {
    const listaPublicacionesUsuario = document.getElementById('listaPublicacionesUsuario');
    function renderUserPublicationsInAjustes() {
        if (!listaPublicacionesUsuario) return;
        listaPublicacionesUsuario.innerHTML = '<h3 class="text-success text-center mb-3">Tus Publicaciones</h3>';
        let publicacionesUsuario = JSON.parse(localStorage.getItem('publicacionesUsuario')) || [];

        if (publicacionesUsuario.length === 0) {
            listaPublicacionesUsuario.innerHTML += '<p class="text-center text-secondary mt-3">Aún no has creado publicaciones.</p>';
            return;
        }

        publicacionesUsuario.forEach(pub => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'd-flex align-items-center bg-light border border-secondary rounded-2 mb-3 p-3 gap-3 shadow-sm';
            itemDiv.innerHTML = `
            <img src="${pub.imagen}" alt="${pub.nombre}" class="object-fit-cover rounded-1 flex-shrink-0" style="width: 80px; height: 80px;">
            <div class="publicacion-usuario-info flex-grow-1">
            <h4 class="m-0 mb-1 text-success fs-5">${pub.nombre}</h4>
            <p class="m-0 fs-6 text-black-50">Precio: ${pub.precio}</p>
            <p class="m-0 fs-6 text-black-50">Autor: ${pub.autor}</p>
            <p class="m-0 fs-6 text-black-50">Descripción: ${pub.descripcion.substring(0, 100)}${pub.descripcion.length > 100 ? '...' : ''}</p>
            </div>
            <div class="publicacion-usuario-acciones d-flex gap-2 flex-shrink-0">
            <button class="btn btn-primary btn-sm btn-editar" data-id="${pub.id}">Editar</button>
            <button class="btn btn-danger btn-sm btn-eliminar" data-id="${pub.id}">Eliminar</button>
            </div>
            `;
            listaPublicacionesUsuario.appendChild(itemDiv);
        });

        // eliminar la publicacion
        listaPublicacionesUsuario.querySelectorAll('.btn-eliminar').forEach(button => {
            button.addEventListener('click', function() {
                const idToDelete = this.getAttribute('data-id');
                eliminarPublicacion(idToDelete);
            });
        });

        listaPublicacionesUsuario.querySelectorAll('.btn-editar').forEach(button => {
            button.addEventListener('click', function() {
                const idToEdit = this.getAttribute('data-id');
                editarPublicacion(idToEdit);
            });
        });
    }
    //cerrar seccion
    const btnCerrarSesion = document.getElementById('cerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function() {
            localStorage.removeItem('usuario');
            window.location.href = 'index.html';
        });
    }
    const menuOpcionesAjustes = document.querySelectorAll('.list-group-item[data-section]');
    const contenidoOpciones = document.querySelectorAll('.contenido-opcion');

    menuOpcionesAjustes.forEach(function(item) {
        item.addEventListener('click', function() {
            menuOpcionesAjustes.forEach(li => {
                li.classList.remove('bg-dark', 'text-white');
                li.classList.add('bg-white', 'text-dark');
            });
            contenidoOpciones.forEach(sec => {
                sec.classList.add('d-none');
                sec.classList.remove('active');
            });

            item.classList.add('bg-dark', 'text-white');
            item.classList.remove('bg-white', 'text-dark');

            const sectionId = item.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.remove('d-none');
                section.classList.add('active');

                if (sectionId === 'publicaciones') {
                    renderUserPublicationsInAjustes();
                } else if (sectionId === 'seguimiento') {
                    renderSeguimientoPedidos();
                }
            }
        });
    });

    // tomamos los valores de las casillas a rellenar para crear un producto
    const publicacionNombre = document.getElementById('publicacionNombre');
    const publicacionPrecio = document.getElementById('publicacionPrecio');
    const publicacionDescripcion = document.getElementById('publicacionDescripcion');
    const publicacionImagenArchivo = document.getElementById('publicacionImagenArchivo');
    const publicacionImagenUrlHidden = document.getElementById('publicacionImagenUrl');
    const publicacionImagenPrevia = document.getElementById('publicacionImagenPrevia');
    const btnCrearPublicacion = document.getElementById('crearPublicacion');
    const panelCrearPublicacion = document.getElementById('panelCrearPublicacion');
    const btnGuardarNuevaPublicacion = document.getElementById('guardarNuevaPublicacion');
    const btnCancelarNuevaPublicacion = document.getElementById('cancelarNuevaPublicacion');
    const mensajePublicacion = document.getElementById('mensajePublicacion');
    const panelPublicacionTitulo = document.getElementById('panelPublicacionTitulo');
    


    if (btnGuardarNuevaPublicacion) {
        btnGuardarNuevaPublicacion.addEventListener('click', async function() {
            const nombre = document.getElementById('publicacionNombre').value.trim();
            const descripcion = document.getElementById('publicacionDescripcion').value.trim();
            const precio = document.getElementById('publicacionPrecio').value.trim();
            const imagen = document.getElementById('publicacionImagenUrl').value.trim();
            const mensajePublicacion = document.getElementById('mensajePublicacion');
            mensajePublicacion.textContent = "";
            mensajePublicacion.className = "mt-3 text-center fw-bold";

            if (!nombre || !precio) {
                mensajePublicacion.textContent = "Por favor, completa al menos el nombre y el precio.";
                mensajePublicacion.classList.add('text-danger');
            return;
            }
            
            try {
                const response = await fetch('../backend/crearPublicacion.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre,
                        descripcion,
                        precio,
                        imagen
                    })
                });
                
                const data = await response.json();
                console.log("Respuesta del servidor:", data);

                if (data.exito) {
                    mensajePublicacion.textContent = "Publicación creada correctamente.";
                    mensajePublicacion.classList.add('text-success');

                    document.getElementById('publicacionNombre').value = "";
                    document.getElementById('publicacionDescripcion').value = "";
                    document.getElementById('publicacionPrecio').value = "";
                    document.getElementById('publicacionImagenArchivo').value = "";
                    document.getElementById('publicacionImagenUrl').value = "";
                    document.getElementById('publicacionImagenPrevia').style.display = "none";

                    setTimeout(() => {
                        document.getElementById('panelCrearPublicacion').classList.add('d-none');
                        mensajePublicacion.textContent = "";
                    }, 1500);
                } else {
                    mensajePublicacion.textContent = "Error al crear la publicación: " + (data.mensaje || 'Desconocido');
                    mensajePublicacion.classList.add('text-danger');
                }

            } catch (error) {
                console.error("Error al enviar la publicación:", error);
                mensajePublicacion.textContent = "Error de conexión con el servidor.";
                mensajePublicacion.classList.add('text-danger');
            }
        });
    }


    if (publicacionImagenArchivo) {
        publicacionImagenArchivo.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    publicacionImagenPrevia.src = e.target.result;
                    publicacionImagenPrevia.style.display = 'block';
                    publicacionImagenUrlHidden.value = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                publicacionImagenPrevia.src = '#';
                publicacionImagenPrevia.style.display = 'none';
                publicacionImagenUrlHidden.value = '';
            }
        });
    }

    function eliminarPublicacion(id) {
        let publicacionesUsuario = JSON.parse(localStorage.getItem('publicacionesUsuario')) || [];
        const nuevasPublicaciones = publicacionesUsuario.filter(pub => pub.id !== id);
        guardarPublicacionesUsuario(nuevasPublicaciones);
        renderUserPublicationsInAjustes();
        if (document.querySelector('.publicacion')) {
            mostrarPublicaciones();
        }
    }
    
    function editarPublicacion(id) {
        let publicacionesUsuario = JSON.parse(localStorage.getItem('publicacionesUsuario')) || [];
        const publicacionAEditar = publicacionesUsuario.find(pub => pub.id === id);

        if (publicacionAEditar) {
            idPublicacionEditando = id;

            panelCrearPublicacion.classList.remove('d-none');
            btnCrearPublicacion.classList.add('d-none');

            document.getElementById('panelPublicacionTitulo').textContent = 'Editar Publicación';
            btnGuardarNuevaPublicacion.textContent = 'Actualizar Publicación';

            publicacionNombre.value = publicacionAEditar.nombre;
            const precioNum = parseFloat(publicacionAEditar.precio.replace('U$S ', '').replace(',', '.'));
            publicacionPrecio.value = precioNum;
            publicacionDescripcion.value = publicacionAEditar.descripcion === 'Sin descripción.' ? '' : publicacionAEditar.descripcion;

            if (publicacionAEditar.imagen) {
                publicacionImagenPrevia.src = publicacionAEditar.imagen;
                publicacionImagenPrevia.style.display = 'block';
                publicacionImagenUrlHidden.value = publicacionAEditar.imagen;
            }
            if (publicacionImagenArchivo) {
                publicacionImagenArchivo.value = '';
            }

            mensajePublicacion.textContent = '';
            mensajePublicacion.className = 'mensaje-publicacion';
        }
    }

    if (btnCrearPublicacion && panelCrearPublicacion) {
        btnCrearPublicacion.addEventListener('click', function() {
            idPublicacionEditando = null;
            panelCrearPublicacion.classList.remove('d-none');
            btnCrearPublicacion.classList.add('d-none');
            mensajePublicacion.textContent = '';
            mensajePublicacion.className = 'mensaje-publicacion';
            publicacionNombre.value = '';
            publicacionPrecio.value = '';
            publicacionDescripcion.value = '';
            publicacionImagenArchivo.value = '';
            publicacionImagenUrlHidden.value = '';
            publicacionImagenPrevia.src = '#';
            publicacionImagenPrevia.style.display = 'none';
            panelPublicacionTitulo.textContent = 'Nueva Publicación';
            btnGuardarNuevaPublicacion.textContent = 'Guardar Publicación';
        });
    }

    if (btnCancelarNuevaPublicacion && panelCrearPublicacion && btnCrearPublicacion) {
        btnCancelarNuevaPublicacion.addEventListener('click', function() {
            panelCrearPublicacion.classList.add('d-none');
            btnCrearPublicacion.classList.remove('d-none');
            publicacionNombre.value = '';
            publicacionPrecio.value = '';
            publicacionDescripcion.value = '';
            publicacionImagenArchivo.value = '';
            publicacionImagenUrlHidden.value = '';
            publicacionImagenPrevia.src = '#';
            publicacionImagenPrevia.style.display = 'none';
            mensajePublicacion.textContent = '';
            mensajePublicacion.className = 'mensaje-publicacion';
            idPublicacionEditando = null;
            panelPublicacionTitulo.textContent = 'Nueva Publicación';
            btnGuardarNuevaPublicacion.textContent = 'Guardar Publicación';
        });
    }
});