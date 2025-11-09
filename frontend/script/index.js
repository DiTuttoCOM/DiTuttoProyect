// ================================
// 🔹 Filtros de categoría, búsqueda y precio
// ================================
const inputBusqueda = document.getElementById("barraBusqueda");
const filtroPrecio = document.getElementById("filtroPrecio");
const botonesCategorias = document.querySelectorAll(".categoria-btn");
let categoriaSeleccionada = "todo";

function renderizarProductos(filtroCategoria = "todo", filtroTexto = "", rangoPrecio = "") {
  const contenedor = document.getElementById("contenedorPublicaciones");
  let productos = JSON.parse(localStorage.getItem("productos")) || [];

  // Filtrado
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

  // Renderizado
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

// Eventos
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

// Mostrar todo al cargar
renderizarProductos();
