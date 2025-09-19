async function cargarProductosBase() {
    const publicacionesUsuario = JSON.parse(localStorage.getItem('publicacionesUsuario')) || [];
    try {
        const response = await fetch('script/index.php');
        const productosDB = await response.json();
        return [...productosDB, ...publicacionesUsuario];
    } catch (error) {
        console.error('Error cargando productos desde la base de datos:', error);
        return [...productosPredefinidos, ...publicacionesUsuario];
    }
}

// Ya no necesitas inicializar productosPredefinidos directamente
let productos = [];
document.addEventListener('DOMContentLoaded', async () => {
    productos = await cargarProductosBase();
    mostrarPublicaciones();
});

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

    
});