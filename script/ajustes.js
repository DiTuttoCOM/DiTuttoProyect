document.addEventListener('DOMContentLoaded', () => {
    //cerrar seccion
    const btnCerrarSesion = document.getElementById('cerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function() {
            localStorage.removeItem('usuario');
            window.location.href = 'index.html';
        });
    }

    //ajustes
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
    const publicacionAutor = document.getElementById('publicacionAutor');
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

    // al crear una oublicacion
    if (btnGuardarNuevaPublicacion) {
        btnGuardarNuevaPublicacion.addEventListener('click', function() {
            const nombre = publicacionNombre.value.trim();
            const precio = parseFloat(publicacionPrecio.value);
            let autor = '';
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            if (usuario && usuario.nombre) {
                autor = usuario.nombre;
            }

            const descripcion = publicacionDescripcion.value.trim();
            const imagenData = publicacionImagenUrlHidden.value.trim();

            //condiciones para crear la publicacion
            if (!nombre) {
                mensajePublicacion.textContent = 'El Nombre del Producto es obligatorio.';
                mensajePublicacion.classList.add('error');
                return;
            }
            if (isNaN(precio) || precio <= 0) {
                mensajePublicacion.textContent = 'El Precio debe ser un número positivo.';
                mensajePublicacion.classList.add('error');
                return;
            }
            if (!imagenData) {
                mensajePublicacion.textContent = 'La Imagen del Producto es obligatoria.';
                mensajePublicacion.classList.add('error');
                return;
            }

            const finalDescripcion = descripcion === '' ? 'Sin descripción.' : descripcion;

            let publicacionesUsuario = JSON.parse(localStorage.getItem('publicacionesUsuario')) || [];
            let mensajeExito = '';

            if (idPublicacionEditando) {
                const index = publicacionesUsuario.findIndex(pub => pub.id === idPublicacionEditando);
                if (index !== -1) {
                    publicacionesUsuario[index] = {
                        id: idPublicacionEditando,
                        nombre: nombre,
                        precio: `U$S ${precio.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                        estrellas: '',
                        autor: autor,
                        descripcion: finalDescripcion,
                        imagen: imagenData
                    };
                    mensajeExito = '¡Publicación actualizada con éxito!';
                }
            } else {
                const nuevaPublicacion = {
                    id: generarIdUnico(),
                    nombre: nombre,
                    precio: `U$S ${precio.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                    estrellas: '',
                    autor: autor,
                    descripcion: finalDescripcion,
                    imagen: imagenData
                };
                publicacionesUsuario.push(nuevaPublicacion);
                mensajeExito = '¡Publicación creada con éxito!';
            }
            guardarPublicacionesUsuario(publicacionesUsuario);
            function guardarPublicacionesUsuario(nuevosProductos) {
                localStorage.setItem('publicacionesUsuario', JSON.stringify(nuevosProductos));
                productos = cargarProductosBase();
            }

            mensajePublicacion.textContent = mensajeExito;
            mensajePublicacion.classList.remove('error');
            mensajePublicacion.classList.add('exito');

            
            //limpiamos los datos para que el usuario pueda crear otra publicacion si asi lo desea
            setTimeout(() => {
                panelCrearPublicacion.classList.add('d-none');
                btnCrearPublicacion.classList.remove('d-none');
                publicacionNombre.value = '';
                publicacionPrecio.value = '';
                publicacionAutor.value = '';
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
            }, 1000); // como que 1000 segundos?

            // imprimimos las publicaciones
            renderUserPublicationsInAjustes();
            if (document.querySelector('.publicacion')) {
                mostrarPublicaciones();
            }
        });
    }

    // lista de las publicaciones que el usuario creo
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

    // limpia
    if (btnCrearPublicacion && panelCrearPublicacion) {
        btnCrearPublicacion.addEventListener('click', function() {
            idPublicacionEditando = null;
            panelCrearPublicacion.classList.remove('d-none');
            btnCrearPublicacion.classList.add('d-none');
            mensajePublicacion.textContent = '';
            mensajePublicacion.className = 'mensaje-publicacion';
            publicacionNombre.value = '';
            publicacionPrecio.value = '';
            publicacionAutor.value = '';
            publicacionDescripcion.value = '';
            publicacionImagenArchivo.value = '';
            publicacionImagenUrlHidden.value = '';
            publicacionImagenPrevia.src = '#';
            publicacionImagenPrevia.style.display = 'none';
            panelPublicacionTitulo.textContent = 'Nueva Publicación';
            btnGuardarNuevaPublicacion.textContent = 'Guardar Publicación';
        });
    }

    // limpia pero bajo otras condiciones
    if (btnCancelarNuevaPublicacion && panelCrearPublicacion && btnCrearPublicacion) {
        btnCancelarNuevaPublicacion.addEventListener('click', function() {
            panelCrearPublicacion.classList.add('d-none');
            btnCrearPublicacion.classList.remove('d-none');
            publicacionNombre.value = '';
            publicacionPrecio.value = '';
            publicacionAutor.value = '';
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

    //cuando compras algo se guarda el pedido, con esto se imprime en seguimientos(ajustes.html)
    function renderSeguimientoPedidos() {
        if (!listaSeguimientoPedidos) return;
        listaSeguimientoPedidos.innerHTML = '';

        let seguimientoUsuario = JSON.parse(localStorage.getItem('seguimientoUsuario')) || [];

        if (seguimientoUsuario.length === 0) {
            listaSeguimientoPedidos.innerHTML = '<p class="text-center text-secondary mt-3">Aún no hay pedidos en seguimiento.</p>';
            return;
        }

        seguimientoUsuario.forEach(pedido => {
            const pedidoDiv = document.createElement('div');
            pedidoDiv.className = 'card bg-light text-black border border-info mb-3 shadow-sm';
            pedidoDiv.innerHTML = `
            <div class="card-header bg-light text-black d-flex justify-content-between align-items-center">
            <h5 class="mb-0 text-info">Pedido</h5> <span class="badge bg-primary">${pedido.estado}</span>
            </div>
            <div class="card-body">
            <p class="card-text text-black">Fecha de compra: ${pedido.fecha}</p>
            <h6 class="text-success mb-3">Productos:</h6>
            <ul class="list-group list-group-flush bg-dark border-0">
            ${pedido.productos.map(prod => `
                <li class="list-group-item d-flex align-items-center bg-light text-black border-bottom border-secondary py-2">
                <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" class="me-3">
                <span class="flex-grow-1">${prod.nombre}</span>
                <span class="text-success fw-bold">${prod.precio}</span>
                <span class="ms-2 text-black-50">x${prod.cantidad}</span>
                </li>
                `).join('')}
                </ul>
                </div>
            `;
            listaSeguimientoPedidos.appendChild(pedidoDiv);
        });
    }
});
