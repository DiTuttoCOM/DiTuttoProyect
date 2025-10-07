// -----------------
// Clase ProductoService
// -----------------
class ProductoService {
    async obtenerProductos() {
        const userId = USER_ID; // Viene del PHP
        const response = await fetch('api/productos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accion: 'obtenerProductos', userId })
        });
        return await response.json(); // lista de productos
    }

    async obtenerProductoPorId(id) {
        const response = await fetch('api/productos.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accion: 'obtenerProducto', id })
        });
        return await response.json();
    }
}

// -----------------
// Mostrar producto individual
// -----------------
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const service = new ProductoService();
    const producto = await service.obtenerProductoPorId(id);
    if (!producto) return;

    document.getElementById('imagenProducto').src = producto.imagen;
    document.getElementById('nombreBarra').textContent = producto.nombre;
    document.getElementById('descripcionProducto').textContent = producto.descripcion;
    document.getElementById('precioProducto').textContent = `U$S ${producto.precio}`;
    document.getElementById('estrellasProducto').textContent = producto.estrellas ? '★'.repeat(Math.round(producto.estrellas)) : '';
    document.getElementById('autorProducto').textContent = producto.autor;
});