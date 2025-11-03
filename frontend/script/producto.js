document.addEventListener('DOMContentLoaded', function() {
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
});