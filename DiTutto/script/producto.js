document.addEventListener('DOMContentLoaded', () => {
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
});