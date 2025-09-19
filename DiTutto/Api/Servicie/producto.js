// productoService.js
class ProductoService {
    constructor() {
        this.productosPredefinidos = [
            { id: '1', nombre: 'PC top ultra hd', precio: 'U$S 2', estrellas: '3', 
              autor: 'Karl Marx', descripcion: 'PC top ultra hd...', imagen: 'styless/img/producto1.webp' },
            // ... más productos
        ];
    }

    async cargarProductos() {
        try {
            const publicacionesUsuario = await this.obtenerPublicacionesUsuario();
            return [...this.productosPredefinidos, ...publicacionesUsuario];
        } catch (error) {
            console.error('Error cargando productos:', error);
            return [];
        }
    }

    async obtenerPublicacionesUsuario() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario) return [];

        try {
            const response = await fetch('api/productos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario.token}`
                },
                body: JSON.stringify({ 
                    accion: 'obtenerPublicacionesUsuario',
                    userId: usuario.id
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo publicaciones del usuario:', error);
            return [];
        }
    }
}