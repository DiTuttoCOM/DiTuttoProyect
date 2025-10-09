function cargarProductosBase() {
  const publicacionesUsuario = JSON.parse(localStorage.getItem('publicacionesUsuario')) || [];
  return [...productosPredefinidos, ...publicacionesUsuario];
}
//productos de base
const productosPredefinidos = [
  {id: '1', nombre: 'PC top ultra hd', precio: 'U$S 2', estrellas: '3', autor: 'Karl Marx', descripcion: 'PC top ultra hd, comprate esto es lo mejor, me lo dijo mi abuela.', imagen: 'styless/img/producto1.webp', reportado: 'N'},
  {id: '2', nombre: 'Licuadora usada por Messi', precio: 'U$S 20.000.000', estrellas: '1', autor: 'Leo Messi', descripcion: 'Che, soy leo mesi. Mira... q mira bobo? ves si soy, ahora compate esto', imagen: 'styless/img/producto2.webp', reportado: 'N'},
  {id: '3', nombre: 'Inodoro Gamer', precio: 'U$S 342', estrellas: '5', autor: 'Vegeta777', descripcion: 'Inodoro Gamer con luces RGB y WiFi. Tambien tiene bluetooth y Alexa.', imagen: 'styless/img/producto3.webp', reportado: 'N'},
  {id: '4', nombre: 'Pistola de portales funcional', precio: 'U$S 900', estrellas: '1', autor: 'Rick Sanchez', descripcion: 'Pistola de portales funcional(liquido para portales se vende por separado)', imagen: 'styless/img/producto4.webp', reportado: 'N'},
  {id: '5', nombre: 'Rastreador de Esferas del dragon', precio: 'U$S 500', estrellas: '2', autor: 'Bulma', descripcion: 'Rastreador de Esferas del dragón. Si lo compras la corporación Capsule te regala una casa en una capsula.', imagen: 'styless/img/producto5.webp', reportado: 'N'},
  {id: '6', nombre: 'Peluche de Vaporeon', precio: 'U$S 40', estrellas: '5', autor: 'Nintendo', descripcion: 'Nintendo no me demandes esto solo es un proyecto de fin de año.', imagen: 'styless/img/producto6.webp', reportado: 'N'},
  {id: '7', nombre: 'Bomba Atomica', precio: 'U$S 25.000.000', estrellas: '2', autor: 'Oppenheimer', descripcion: '"Ahora me he convertido en la muerte, el destructor de mundos"', imagen: 'styless/img/producto7.webp', reportado: 'N'}
];

let productos = cargarProductosBase();
function guardarPublicacionesUsuario(nuevosProductos) {
    localStorage.setItem('publicacionesUsuario', JSON.stringify(nuevosProductos));
    productos = cargarProductosBase();
}



document.addEventListener('DOMContentLoaded', function() {

    //Iniciar seccion/registrarse
    function seccionPestañas(selectorBotones, selectorContenido, claseActiva = 'active', clasesExtra = []) {
        const botones = document.querySelectorAll(selectorBotones);
        if (!botones.length) return;
        botones.forEach(boton => {
            boton.addEventListener('click', () => {
                botones.forEach(b => b.classList.remove(claseActiva));
                document.querySelectorAll(selectorContenido).forEach(c => {
                    c.classList.remove(claseActiva, ...clasesExtra);
                });
                boton.classList.add(claseActiva);
                const tab = boton.getAttribute('data-tab');
                const contenido = document.getElementById(tab);
                if (contenido) contenido.classList.add(claseActiva, ...clasesExtra);
            });
        });
    }
    seccionPestañas('.pestana-boton', '.contenido-pestana');
    seccionPestañas('[data-tab]', '.tab-pane', 'active', ['show']);

    // Botón registrarse
    const botonRegistrar = document.querySelector('.boton-registrar');
    if (botonRegistrar) {
        botonRegistrar.addEventListener('click', (e) => {
            e.preventDefault();
            let errorDiv = document.getElementById('mensaje-error');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.id = 'mensaje-error';
                errorDiv.style.color = 'red';
                errorDiv.style.margin = '10px 0';
                botonRegistrar.parentElement.insertBefore(errorDiv, botonRegistrar);
            }
            errorDiv.textContent = '';

            // Variables de inputs
            const nombreInput = document.getElementById('nombre');
            const emailInput = document.getElementById('email');
            const contrasenaInput = document.getElementById('contrasena');
            const confirmarContrasenaInput = document.getElementById('confirmarContr');
            const fechaNacimientoInput = document.getElementById('fechaNac');

            // Validaciones
            switch (true) {
                case (nombreInput.value === "" || emailInput.value === "" || contrasenaInput.value === "" || confirmarContrasenaInput.value === "" || fechaNacimientoInput.value === ""):
                    errorDiv.textContent = "Rellene todos los campos, por favor.";
                    return;
                case (contrasenaInput.value !== confirmarContrasenaInput.value):
                    errorDiv.textContent = "Las contraseñas no coinciden.";
                    return;
                case (!/^([a-zA-Z0-9._%+-]+)@gmail\.com$/.test(emailInput.value)):
                    errorDiv.textContent = "El correo debe ser un gmail válido.";
                    return;
                default:
                    const fecha = new Date(fechaNacimientoInput.value);
                    const hoy = new Date();
                    const minFecha = new Date('1900-01-01');
                    if (isNaN(fecha.getTime()) || fecha > hoy || fecha < minFecha) {
                        errorDiv.textContent = "La fecha de nacimiento no tiene sentido.";
                        return;
                    }
                    const usuario = {
                        nombre: nombreInput.value,
                        email: emailInput.value,
                        contrasena: contrasenaInput.value,
                        fechaNacimiento: fechaNacimientoInput.value,
                        rango: emailInput.value === "bentancorguido@gmail.com" ? "admin" : "usuario"
                    };
                    localStorage.setItem('usuario', JSON.stringify(usuario));
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCuenta'));
                    if (modal) modal.hide();
                    window.location.href = 'index.html';
            }
        });
    }
    //Si el localStorage tiene la variable usuario, reemplasamos el botom de iniciar seccion con el de ajustes
    function verificarSesion() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const btnCuenta = document.querySelector('.btnCuenta');
        
        if (usuario && btnCuenta) {
            let nuevoBtn;
            if (usuario.rango === "admin") {
                nuevoBtn = document.createElement('a');
                nuevoBtn.href = 'admin.html';
                nuevoBtn.textContent = '🛠️';
                nuevoBtn.classList.add('btn', 'btn-light', 'rounded-pill', 'px-3');
            } else {
                nuevoBtn = document.createElement('a');
                nuevoBtn.href = 'ajustes.html';
                nuevoBtn.textContent = '⚙️';
                nuevoBtn.classList.add('btn', 'btn-light', 'rounded-pill', 'px-3');
            }
            btnCuenta.replaceWith(nuevoBtn);
        }
    }
    verificarSesion();

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

    //Mosramos las publicaciones
    function mostrarPublicaciones() {
        const publicacionDiv = document.querySelector('.publicacion');
        if (!publicacionDiv) return;
        productos.forEach(producto => {
            const div = document.createElement('div');
            div.className = 'casilla-publicacion';
            div.dataset.id = producto.id;
            const estrella = producto.estrellas ? '⭐'.repeat(producto.estrellas) : '';
            div.innerHTML = `
            <div class="bg-white">
            <img src="${producto.imagen}" class="card-img-top publicacion-imagen" alt="${producto.nombre}">
            <div class="card-body d-flex flex-column p-3">
            <h5 class="card-title text-center text-truncate mb-2">${producto.nombre}</h5>
            <p class="text-muted small mb-2">${producto.descripcion}</p>
            ${estrella ? `<div class="text-warning fs-6 text-nowrap">${estrella}</div>` : ''}
            <div class="fw-bold text-success fs-6 text-nowrap">${producto.precio}</div>
            </div>
            </div>
            `;
            publicacionDiv.appendChild(div);
            div.addEventListener('click', () => {
                window.location.href = `producto.html?id=${producto.id}`;
            });
        });
    }
    mostrarPublicaciones();

    // esto le da los datos a producto.html para que pueda mostrarlo
    if (document.getElementById('imagenProducto')) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        let productoActual = null;
        
        if (id) {
            productoActual = productos.find(p => p.id === id);
            if (productoActual) {
                document.getElementById('imagenProducto').src = productoActual.imagen;
                document.getElementById('nombreBarra').textContent = productoActual.nombre;
                document.getElementById('descripcionProducto').textContent = productoActual.descripcion;
                document.getElementById('precioProducto').textContent = productoActual.precio;
                const estrellasElem = document.getElementById('estrellasProducto');
                if (estrellasElem) {
                    estrellasElem.textContent = productoActual.estrellas ? '⭐'.repeat(productoActual.estrellas) : '';
                }
                document.getElementById('autorProducto').textContent = productoActual.autor;
            }
        }
        // Banear publicacion
        const btnAddCarrito = document.getElementById('btnAddCarrito');
        const usuario = JSON.parse(localStorage.getItem('usuario')); 
        
        if (usuario && usuario.rango === 'admin') {
            const btnBanear = document.createElement('button');
            btnBanear.textContent = 'Banear';
            btnBanear.classList.add('btn', 'btn-danger', 'mx-2');
            btnBanear.setAttribute('data-bs-toggle', 'modal');
            btnBanear.setAttribute('data-bs-target', '#modalBaneo');

            if (btnAddCarrito) {
                btnAddCarrito.parentElement.insertBefore(btnBanear, btnAddCarrito);
                btnAddCarrito.remove();
            }

            const btnBanearModal = document.getElementById('btnBanearModal');
            btnBanearModal.addEventListener('click', () => {
                const razon = document.getElementById('razonBaneo').value.trim();
                if (!razon) {
                    alert("Debes escribir una razón para el baneo.");
                    return;
                }
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalBaneo'));
                modal.hide();
                document.getElementById('razonBaneo').value = '';
                eliminarPublicacion(id)
            });
        } else {
            // Usuario botón de carrito
            if (btnAddCarrito) {
                btnAddCarrito.disabled = !productoActual;
                if (productoActual) {
                    btnAddCarrito.addEventListener('click', function() {
                        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                        const idx = carrito.findIndex(p => p.id === productoActual.id);
                        if (idx !== -1) {
                            carrito[idx].cantidad = (carrito[idx].cantidad || 1) + 1;
                        } else {
                            carrito.push({ ...productoActual, cantidad: 1 });
                        }
                        localStorage.setItem('carrito', JSON.stringify(carrito));
                        btnAddCarrito.textContent = '¡En el carrito!';
                        btnAddCarrito.disabled = true;
                    });
                }
            }
        }
    }

    // reportar
    const btnReportar = document.getElementById('btnReportar');
    if (btnReportar) {
        btnReportar.addEventListener('click', () => {
            producto.reportado = 'S';
        });
    }

    // carrito
    const btnComprarCarrito = document.getElementById('btnComprarCarrito');
    const listaSeguimientoPedidos = document.getElementById('listaSeguimientoPedidos');

    function mostrarCarrito() {
        const carritoLista = document.querySelector('.carrito-lista');
        if (!carritoLista) return;
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoLista.innerHTML = '';
        let total = 0;

        // si esta vacio
        if (carrito.length === 0) {
            carritoLista.innerHTML = '<p style="text-align:center; color:#888;">El carrito está vacío.</p>';
            document.getElementById('total-carrito').textContent = '$0';
            if (btnComprarCarrito) {
                btnComprarCarrito.disabled = true;
            }
            return;
        }

        // si tiene algo
        carrito.forEach((producto, idx) => {
            let precioNum = 0;
            if (producto.precio) {
                let limpio = producto.precio.replace('U$S ', '').replace(/[^\d.,]/g, '').replace(/,/g, '.');
                precioNum = parseFloat(limpio) || 0;
            }
            total += precioNum * (producto.cantidad || 1);
            const item = document.createElement('div');
            item.className = 'carrito-item-barra';
            item.style = 'display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #eee;';
            item.innerHTML = `
                <img src="${producto.imagen}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;">
                <span style="flex:1;font-weight:bold; color: #f8f9fa;">${producto.nombre}</span>
                <span style="color:#28a745;font-weight:bold;">${producto.precio}</span>
                <span style="margin-left:8px;color:#f8f9fa;">x${producto.cantidad || 1}</span>
                <button class="btn btn-danger btn-sm" style="margin-left:10px;" data-idx="${idx}">Eliminar</button>
            `;
            carritoLista.appendChild(item);
        });
        //sacamos la cuenta de cuanto cuesta el pedido(en dolares porque somos chetos)
        document.getElementById('total-carrito').textContent = 'U$S' + total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        if (btnComprarCarrito) {
            btnComprarCarrito.disabled = false;
        }
        //boton eliminar
        const btnsEliminar = carritoLista.querySelectorAll('.btn-danger');
        btnsEliminar.forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(btn.getAttribute('data-idx'));
                let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                carrito.splice(idx, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
            });
        });
    }

    // carrito
    if (document.getElementById('modalCarrito')) {
        document.getElementById('modalCarrito').addEventListener('show.bs.modal', mostrarCarrito);
    }
    if (document.querySelector('.carrito-boton')) {
        mostrarCarrito();
    }
    function generarIdUnico() {
        let maxId = 0;
        if (Array.isArray(productos)) {
            productos.forEach(p => {
                let idNum = parseInt(p.id);
                if (!isNaN(idNum) && idNum > maxId) {
                    maxId = idNum;
                }
            });
        }
        return maxId + 1;
    }
    //al comprar hacemos que se vacie todo y se guarde como pedido
    if (btnComprarCarrito) {
        btnComprarCarrito.addEventListener('click', function() {
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            if (carrito.length === 0) {
                alert('El carrito está vacío. No hay nada que comprar.');
                return;
            }

            let seguimientoUsuario = JSON.parse(localStorage.getItem('seguimientoUsuario')) || [];
            const fechaCompra = new Date().toLocaleString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

            const nuevoPedido = {
                id: generarIdUnico(),
                fecha: fechaCompra,
                productos: carrito.map(item => ({
                    id: item.id,
                    nombre: item.nombre,
                    precio: item.precio,
                    cantidad: item.cantidad || 1,
                    imagen: item.imagen
                })),
                estado: 'Pendiente'
            };

            seguimientoUsuario.push(nuevoPedido);
            localStorage.setItem('seguimientoUsuario', JSON.stringify(seguimientoUsuario));

            localStorage.removeItem('carrito');

            mostrarCarrito();

            alert('¡Compra realizada con éxito! Puedes ver el seguimiento en tus Ajustes.');
            window.location.href = 'index.html';

            const modalCarritoInstance = bootstrap.Modal.getInstance(document.getElementById('modalCarrito'));
            if (modalCarritoInstance) {
                modalCarritoInstance.hide();
            }

            if (document.getElementById('seguimiento') && document.getElementById('seguimiento').classList.contains('active')) {
                renderSeguimientoPedidos();
            }
        });
    }


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