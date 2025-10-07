// -----------------
// Clase ProductoService
// -----------------
class ProductoService {
  async obtenerProductos() {
    try {
      const response = await fetch('script/productos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'obtenerProductos' })
      });
      const data = await response.json();
      return data.success ? data.productos : [];
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }
  }

  async obtenerProductoPorId(id) {
    try {
      const response = await fetch('script/productos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'obtenerProducto', id })
      });
      const data = await response.json();
      return data.success ? data.producto : null;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      return null;
    }
  }
}

// -----------------
// Cargar productos al iniciar
// -----------------
let productos = [];

document.addEventListener('DOMContentLoaded', async () => {
  const service = new ProductoService();
  productos = await service.obtenerProductos();
  mostrarPublicaciones();
  verificarSesion();
  configurarRegistro();
  configurarCarrito();
  configurarBuscador();
  configurarPestañas();
});

// -----------------
// Mostrar productos (sin cambios grandes)
// -----------------
function mostrarPublicaciones() {
  const publicacionDiv = document.querySelector('.publicacion');
  if (!publicacionDiv) return;
  publicacionDiv.innerHTML = '';

  if (productos.length === 0) {
    publicacionDiv.innerHTML = '<p style="text-align:center; color:#888;">No se encontraron productos.</p>';
    return;
  }

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
          <div class="fw-bold text-success fs-6 text-nowrap">U$S ${producto.precio}</div>
        </div>
      </div>
    `;
    div.addEventListener('click', () => {
      window.location.href = `producto.html?id=${producto.id}`;
    });
    publicacionDiv.appendChild(div);
  });
}