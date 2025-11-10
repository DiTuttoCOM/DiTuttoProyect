document.addEventListener('DOMContentLoaded', () => {
    const modalBody = document.querySelector('#modalCarrito .modal-body .carrito-lista');
    const totalElem = document.querySelector('#modalCarrito .modal-footer .text-success');
    const btnComprar = document.querySelector('#modalCarrito .btn-success');
    const carritoBtn = document.querySelector('.carrito-boton');
    const modal = document.getElementById('modalCarrito');

    function actualizarCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        modalBody.innerHTML = '';

        if (carrito.length === 0) {
            modalBody.innerHTML = `<p class="text-center text-muted mt-3">🛒 El carrito está vacío</p>`;
            totalElem.textContent = 'U$S 0.00';
            actualizarContador();
            return;
        }

        let total = 0;
        carrito.forEach((producto, index) => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;

            const item = document.createElement('div');
            item.className = 'd-flex align-items-center justify-content-between border-bottom py-2';
            item.innerHTML = `
                <div class="d-flex align-items-center gap-3">
                    <img src="${producto.imagen_url}" class="rounded" alt="${producto.nombre}" style="width:40px;height:40px;object-fit:cover;">
                    <div>
                        <p class="mb-0 fw-bold">${producto.nombre}</p>
                        <div class="input-group input-group-sm mt-1" style="max-width: 120px;">
                            <button class="btn btn-outline-secondary btn-restar">-</button>
                            <input type="text" class="form-control text-center cantidad-input" value="${producto.cantidad}" readonly>
                            <button class="btn btn-outline-secondary btn-sumar">+</button>
                        </div>
                    </div>
                </div>
                <div class="text-end">
                    <span class="text-success fw-bold d-block">U$S ${subtotal.toFixed(2)}</span>
                    <button class="btn btn-danger btn-sm mt-1 btn-eliminar">Eliminar</button>
                </div>
            `;

            item.querySelector('.btn-eliminar').addEventListener('click', () => {
                carrito.splice(index, 1);
                guardarCarrito(carrito);
                actualizarCarrito();
            });

            item.querySelector('.btn-sumar').addEventListener('click', () => {
                carrito[index].cantidad++;
                guardarCarrito(carrito);
                actualizarCarrito();
            });

            item.querySelector('.btn-restar').addEventListener('click', () => {
                if (carrito[index].cantidad > 1) {
                    carrito[index].cantidad--;
                } else {
                    carrito.splice(index, 1);
                }
                guardarCarrito(carrito);
                actualizarCarrito();
            });

            modalBody.appendChild(item);
        });

        totalElem.textContent = `U$S ${total.toFixed(2)}`;
        actualizarContador();
    }

    function guardarCarrito(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function actualizarContador() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const cantidadTotal = carrito.reduce((sum, p) => sum + p.cantidad, 0);
        carritoBtn.textContent = `🛒 (${cantidadTotal})`;
    }

    btnComprar.addEventListener('click', () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (carrito.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        localStorage.removeItem('carrito');
        actualizarContador();

        alert('Redirigiendo al pago seguro en Mercado Pago...');
        window.location.href = 'https://link.mercadopago.com.uy/dituttosite';
    });

    actualizarCarrito();

    modal.addEventListener('show.bs.modal', actualizarCarrito);
});