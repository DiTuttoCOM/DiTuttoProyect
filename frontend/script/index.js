document.addEventListener('DOMContentLoaded', function() {
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
    seccionPestañas('.pestana-boton', '.contenido-pestana', 'active', ['show']);

    const botonRegistrar = document.querySelector('.boton-registrar');
    if (botonRegistrar) {
        botonRegistrar.addEventListener('click', async (e) => {
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
            
            const nombreInput = document.getElementById('nombre');
            const emailInput = document.getElementById('email');
            const contrasenaInput = document.getElementById('contrasena');
            const confirmarContrasenaInput = document.getElementById('confirmarContr');
            const fechaNacimientoInput = document.getElementById('fechaNac');

            // Validaciones básicas
            if (!nombreInput.value || !emailInput.value || !contrasenaInput.value || !confirmarContrasenaInput.value || !fechaNacimientoInput.value) {
                errorDiv.textContent = "Rellene todos los campos, por favor.";
                return;
            }
            if (contrasenaInput.value !== confirmarContrasenaInput.value) {
                errorDiv.textContent = "Las contraseñas no coinciden.";
                return;
            }
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput.value)) {
                errorDiv.textContent = "El correo debe ser un Gmail válido.";
                return;
            }
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
                password: contrasenaInput.value,
                fecha_nacimiento: fechaNacimientoInput.value
            };

            try {
                const res = await fetch('../backend/registro.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuario)
                });
                
                const data = await res.json();
                console.log('RESPUESTA REGISTRO ->', data);

                if (data.ok) {
                    const usuarioGuardado = {
                        id_usuario: data.usuario.id_usuario,
                        nombre: data.usuario.nombre,
                        email: data.usuario.email,
                        rango: data.usuario.rango,
                        password_hash: data.usuario.password_hash || null
                    };
                    
                    localStorage.setItem('usuario', JSON.stringify(usuarioGuardado));
                    
                    alert('Usuario registrado con éxito');
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCuenta'));
                    if (modal) modal.hide();
                    window.location.reload();
                } else {
                    errorDiv.textContent = data.mensaje || data.db_error || 'Error al registrar';
                }
            } catch (err) {
                console.error(err);
                errorDiv.textContent = 'Error al conectar con el servidor.';
            }
        });
    }
    
    const botonLogin = document.querySelector('.boton-login');
    if (botonLogin) {
        botonLogin.addEventListener('click', async () => {
            const errorDiv = document.getElementById('mensaje-error-login');
            errorDiv.textContent = '';

            const email = document.getElementById('emailLogin').value.trim();
            const contrasena = document.getElementById('contrasenaLogin').value.trim();

            if (!email || !contrasena) {
                errorDiv.textContent = 'Por favor complete todos los campos.';
                return;
            }

            try {
                const respuesta = await fetch('../backend/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, contrasena })
                });

                const data = await respuesta.json();

                if (!data.ok) {
                    errorDiv.textContent = data.mensaje;
                    return;
                }
            
                if (data.ok) {
                    const usuarioGuardado = {
                        id_usuario: data.usuario.id_usuario,
                        nombre: data.usuario.nombre,
                        email: data.usuario.email,
                        rango: data.usuario.rango,
                        password_hash: data.usuario.password_hash || null
                    };
            
                    localStorage.setItem('usuario', JSON.stringify(usuarioGuardado));
                    const errorDiv = document.getElementById('mensaje-error-login');
                    errorDiv.style.color = 'green';
                    errorDiv.textContent = 'Inicio de sesión exitoso. Redirigiendo...';

                    setTimeout(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('modalCuenta'));
                        if (modal) modal.hide();
                        window.location.reload();
                    }, 1000);
                }
            } catch (error) {
                console.error(error);
                errorDiv.textContent = 'Error al conectar con el servidor.';
            }
        });
    }
    
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
    
    const contenedor = document.getElementById('contenedorPublicaciones');
    if (!contenedor) {
        console.warn("⚠️ No se encontró el contenedor de publicaciones, se omite la carga.");
        return;
    }
    contenedor.innerHTML = "...";
    
    function mostrarPublicaciones(publicaciones) {
        if (!publicaciones || publicaciones.length === 0) {
            contenedor.innerHTML = '<p>No hay productos disponibles</p>';
            return;
        }

        contenedor.innerHTML = '';

        publicaciones.forEach(publicacion => {
            const div = document.createElement('div');
            div.className = 'col-12 col-md-4 casilla-publicacion mb-3';
            div.dataset.id = publicacion.id_publicacion;
            const estrella = publicacion.calificacion ? '⭐'.repeat(Math.round(publicacion.calificacion)) : '';
            div.innerHTML = `
                <div class="card h-100">
                    <img src="${publicacion.imagen_url}" class="card-img-top" alt="${publicacion.nombre}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-center text-truncate mb-2">${publicacion.nombre}</h5>
                        <p class="text-muted small mb-2">${publicacion.descripcion}</p>
                        ${estrella ? `<div class="text-warning fs-6 text-nowrap">${estrella}</div>` : ''}
                        <div class="fw-bold text-success fs-6 text-nowrap">$${publicacion.precio}</div>
                    </div>
                </div>
            `;
            div.addEventListener('click', () => {
                window.location.href = `producto.html?id=${publicacion.id_publicacion}`;
            });

            contenedor.appendChild(div);
        });
    }

    fetch('../backend/publicaciones.php')
    .then(res => res.json())
    .then(data => {
        console.log('DATA QUE LLEGA DEL PHP:', data);
        mostrarPublicaciones(data);
    })
    .catch(err => console.error('Error al cargar publicaciones:', err));

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const imagenElem = document.getElementById('imagenProducto');
    const nombreElem = document.getElementById('nombreBarra');
    const descripcionElem = document.getElementById('descripcionProducto');
    const precioElem = document.getElementById('precioProducto');
    const estrellasElem = document.getElementById('estrellasProducto');
    const autorElem = document.getElementById('autorProducto');
    const btnAddCarrito = document.getElementById('btnAddCarrito');

    fetch('../backend/publicaciones.php')
    .then(res => res.json())
    .then(data => {
        console.log('DATA DEL PHP:', data);
        
        const publicacion = data.find(p => String(p.id_publicacion) === String(id));
        if (!publicacion) {
            console.error('Producto no encontrado');
            return;
        }

        imagenElem.src = publicacion.imagen_url;
        nombreElem.textContent = publicacion.nombre;
        descripcionElem.textContent = publicacion.descripcion;
        precioElem.textContent = `$${publicacion.precio}`;
        estrellasElem.textContent = publicacion.calificacion ? '⭐'.repeat(Math.round(publicacion.calificacion)) : '';
        autorElem.textContent = publicacion.autor || 'Desconocido';

        const usuario = JSON.parse(localStorage.getItem('usuario')) || {};

        if (usuario.rango === 'admin') {
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
                eliminarPublicacion(id);
            });
        } else if (btnAddCarrito) {
            btnAddCarrito.disabled = false;
            btnAddCarrito.addEventListener('click', () => {
                let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                const idx = carrito.findIndex(p => p.id_publicacion == id);
                if (idx !== -1) {
                    carrito[idx].cantidad = (carrito[idx].cantidad || 1) + 1;
                } else {
                    carrito.push({ ...publicacion, cantidad: 1 });
                }
                localStorage.setItem('carrito', JSON.stringify(carrito));
                btnAddCarrito.textContent = '¡En el carrito!';
                btnAddCarrito.disabled = true;
            });
        }
    })
    .catch(err => console.error('Error al cargar la publicación:', err));


    const btnComprarCarrito = document.getElementById('btnComprarCarrito');

    async function obtenerPublicaciones() {
        const publicacionesUsuario = JSON.parse(localStorage.getItem('publicacionesUsuario')) || [];
        let publicacionesBackend = [];
        try {
            const res = await fetch('../backend/publicaciones.php');
            publicacionesBackend = await res.json();
        } catch (e) {
            console.error('Error cargando publicaciones backend:', e);
        }
        return [...publicacionesBackend, ...publicacionesUsuario];
    }

    async function mostrarCarrito() {
        const carritoLista = document.querySelector('.carrito-lista');
        const totalSpan = document.getElementById('total-carrito');
        if (!carritoLista || !totalSpan) return;

        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoLista.innerHTML = '';

        if (carrito.length === 0) {
            carritoLista.innerHTML = '<p style="text-align:center; color:#888;">El carrito está vacío.</p>';
            totalSpan.textContent = '$0';
            if (btnComprarCarrito) btnComprarCarrito.disabled = true;
            return;
        }

        const publicaciones = await obtenerPublicaciones();
        let total = 0;

        carrito.forEach((item, idx) => {
            const producto = publicaciones.find(p => String(p.id_publicacion || p.id) === String(item.id));
            if (!producto) return;

            let precioNum = 0;
            if (producto.precio) {
                let limpio = producto.precio.replace('U$S ', '').replace(/[^\d.,]/g, '').replace(/,/g, '.');
                precioNum = parseFloat(limpio) || 0;
            }
            total += precioNum * (item.cantidad || 1);

            const itemDiv = document.createElement('div');
            itemDiv.className = 'carrito-item-barra';
            itemDiv.style = 'display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #eee;';
            itemDiv.innerHTML = `
                <img src="${producto.imagen || producto.imagen_url}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;">
                <span style="flex:1;font-weight:bold; color: #f8f9fa;">${producto.nombre}</span>
                <span style="color:#28a745;font-weight:bold;">${producto.precio}</span>
                <span style="margin-left:8px;color:#f8f9fa;">x${item.cantidad || 1}</span>
                <button class="btn btn-danger btn-sm" data-idx="${idx}">Eliminar</button>
            `;
            carritoLista.appendChild(itemDiv);
        });

        totalSpan.textContent = 'U$S ' + total.toLocaleString('es-AR', {minimumFractionDigits:2, maximumFractionDigits:2});
        if (btnComprarCarrito) btnComprarCarrito.disabled = false;

        carritoLista.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'));
                carrito.splice(idx, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
            });
        });
    }

    if (btnAddCarrito) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        btnAddCarrito.addEventListener('click', () => {
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const idx = carrito.findIndex(p => p.id == id);
            if (idx !== -1) {
                carrito[idx].cantidad = (carrito[idx].cantidad || 1) + 1;
            } else {
                carrito.push({ id: id, cantidad: 1 });
            }
            localStorage.setItem('carrito', JSON.stringify(carrito));
            btnAddCarrito.textContent = '¡En el carrito!';
            btnAddCarrito.disabled = true;
        });
    }

    if (btnComprarCarrito) {
        btnComprarCarrito.addEventListener('click', async () => {
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            if (carrito.length === 0) {
                alert('El carrito está vacío.');
                return;
            }

            const publicaciones = await obtenerPublicaciones();
            const seguimientoUsuario = JSON.parse(localStorage.getItem('seguimientoUsuario')) || [];
            const fechaCompra = new Date().toLocaleString('es-AR', {year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'});

            const nuevoPedido = {
                id: Date.now(),
                fecha: fechaCompra,
                productos: carrito.map(c => {
                    const p = publicaciones.find(x => String(x.id_publicacion || x.id) === String(c.id));
                    return {
                        id: c.id,
                        cantidad: c.cantidad,
                        nombre: p?.nombre || 'Desconocido',
                        precio: p?.precio || 'U$S 0',
                        imagen: p?.imagen || p?.imagen_url || ''
                    };
                }),
                estado: 'Pendiente'
            };

            seguimientoUsuario.push(nuevoPedido);
            localStorage.setItem('seguimientoUsuario', JSON.stringify(seguimientoUsuario));
            localStorage.removeItem('carrito');

            alert('¡Compra realizada con éxito!');
            mostrarCarrito();

            const modalCarritoInstance = bootstrap.Modal.getInstance(document.getElementById('modalCarrito'));
            if (modalCarritoInstance) modalCarritoInstance.hide();
            window.location.href = 'index.html';
        });
    }

    const modalEl = document.getElementById('modalCarrito');
    if (modalEl) {
        modalEl.addEventListener('show.bs.modal', mostrarCarrito);
    }

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