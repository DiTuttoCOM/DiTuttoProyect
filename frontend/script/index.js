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


    const inputBusqueda = document.getElementById("barraBusqueda");
const filtroPrecio = document.getElementById("filtroPrecio");
const botonesCategorias = document.querySelectorAll(".categoria-btn");
let categoriaSeleccionada = "todo";

function renderizarProductos(filtroCategoria = "todo", filtroTexto = "", rangoPrecio = "") {
  const contenedor = document.getElementById("contenedorPublicaciones");
  let productos = JSON.parse(localStorage.getItem("productos")) || [];

  productos = productos.filter(p => {
    const coincideCategoria = filtroCategoria === "todo" || p.categoria === filtroCategoria;
    const coincideTexto = p.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincidePrecio = (() => {
      if (!rangoPrecio) return true;
      const [min, max] = rangoPrecio.split("-").map(Number);
      return p.precio >= min && p.precio <= max;
    })();
    return coincideCategoria && coincideTexto && coincidePrecio;
  });

  contenedor.innerHTML = productos.map(p => `
    <div class="card col-md-3 col-sm-5 col-10 p-0 shadow-sm border-success" style="min-width: 220px;">
      <a href="producto.html?id=${p.id_publicacion || p.id}" class="text-decoration-none text-dark">
        <img src="${p.imagen_url}" class="card-img-top" alt="${p.nombre}" style="height: 200px; object-fit: cover;">
        <div class="card-body text-center">
          <h5 class="card-title text-success">${p.nombre}</h5>
          <p class="fw-bold text-dark">U$S ${p.precio}</p>
        </div>
      </a>
    </div>
  `).join("");
}


inputBusqueda.addEventListener("input", () =>
  renderizarProductos(categoriaSeleccionada, inputBusqueda.value, filtroPrecio.value)
);
filtroPrecio.addEventListener("change", () =>
  renderizarProductos(categoriaSeleccionada, inputBusqueda.value, filtroPrecio.value)
);
botonesCategorias.forEach(btn => {
  btn.addEventListener("click", () => {
    botonesCategorias.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    categoriaSeleccionada = btn.dataset.categoria;
    renderizarProductos(categoriaSeleccionada, inputBusqueda.value, filtroPrecio.value);
  });
});

renderizarProductos();
});

const chatToggle = document.getElementById('chatToggle');
const chatContainer = document.getElementById('chatContainer');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const messages = document.getElementById('messages');

chatToggle.addEventListener('click', () => {
  chatContainer.style.display = chatContainer.style.display === 'flex' ? 'none' : 'flex';
});

function sendMessage() {
  const msg = userInput.value.trim();
  if(!msg) return;

  const userMsg = document.createElement('div');
  userMsg.classList.add('message', 'user');
  userMsg.textContent = msg;
  messages.appendChild(userMsg);

  userInput.value = '';
  messages.scrollTop = messages.scrollHeight;

  const botMsg = document.createElement('div');
  botMsg.classList.add('message', 'bot');
  botMsg.textContent = "Lo sentimos, la IA está en mantenimiento. Inténtelo de nuevo más tarde.";
  messages.appendChild(botMsg);

  messages.scrollTop = messages.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
  if(e.key === 'Enter') sendMessage();
});
