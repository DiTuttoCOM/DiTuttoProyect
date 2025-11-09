document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        console.warn('⚠️ No se proporcionó un ID de producto.');
        return;
    }

    // Elementos del DOM
    const imagenElem = document.getElementById('imagenProducto');
    const nombreElem = document.getElementById('nombreBarra');
    const descripcionElem = document.getElementById('descripcionProducto');
    const precioElem = document.getElementById('precioProducto');
    const estrellasElem = document.getElementById('estrellasProducto');
    const autorElem = document.getElementById('autorProducto');
    const btnAddCarrito = document.getElementById('btnAddCarrito');

    let productos = [];

    try {
        // Primero intenta desde localStorage
        productos = JSON.parse(localStorage.getItem('productos')) || [];

        // Si no hay nada, intenta desde JSON
        if (productos.length === 0) {
            const res = await fetch('./script/productos.json');
            if (res.ok) {
                productos = await res.json();
                localStorage.setItem('productos', JSON.stringify(productos));
                console.log('📦 Productos cargados desde JSON local.');
            } else {
                throw new Error(`HTTP ${res.status}`);
            }
        }
    } catch (err) {
        console.warn('⚠️ No se pudieron cargar productos reales, usando datos por defecto:', err);
        productos = [
            {
                id: 1,
                nombre: "Producto genérico A",
                descripcion: "Descripción temporal de ejemplo.",
                precio: 9.99,
                imagen_url: "styless/img/no-image.png",
                calificacion: 5,
                autor: "Sistema"
            },
            {
                id: 2,
                nombre: "Producto genérico B",
                descripcion: "Producto cargado por defecto.",
                precio: 14.99,
                imagen_url: "styless/img/no-image.png",
                calificacion: 4,
                autor: "Sistema"
            }
        ];
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    // 🔹 Buscar el producto por ID
    const publicacion = productos.find(p => String(p.id_publicacion || p.id) === String(id))
        || productos[0]; // 👉 Si no encuentra el ID, muestra el primero

    // 🔹 Mostrar los datos en pantalla
    if (imagenElem) imagenElem.src = publicacion.imagen_url || 'styless/img/no-image.png';
    if (nombreElem) nombreElem.textContent = publicacion.nombre;
    if (descripcionElem) descripcionElem.textContent = publicacion.descripcion || 'Sin descripción disponible.';
    if (precioElem) precioElem.textContent = `U$S ${publicacion.precio}`;
    if (estrellasElem) estrellasElem.textContent = publicacion.calificacion
        ? '⭐'.repeat(Math.round(publicacion.calificacion))
        : '⭐'.repeat(5);
    if (autorElem) autorElem.textContent = publicacion.autor || 'Desconocido';

    // 🔹 Agregar al carrito
    if (btnAddCarrito) {
        btnAddCarrito.disabled = false;
        btnAddCarrito.addEventListener('click', () => {
            const producto = {
                id: publicacion.id_publicacion || publicacion.id,
                nombre: publicacion.nombre,
                precio: parseFloat(publicacion.precio),
                imagen: publicacion.imagen_url,
                cantidad: 1
            };

            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const idx = carrito.findIndex(p => p.id == producto.id);
            if (idx !== -1) {
                carrito[idx].cantidad++;
            } else {
                carrito.push(producto);
            }
            localStorage.setItem('carrito', JSON.stringify(carrito));

            btnAddCarrito.textContent = '✅ Agregado';
            btnAddCarrito.disabled = true;
        });
    }
});
