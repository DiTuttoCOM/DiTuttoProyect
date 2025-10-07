class PedidoService {
    constructor(usuario) {
        this.usuario = usuario; 
        this.carrito = [];
    }

    agregarAlCarrito(producto) {
        const idx = this.carrito.findIndex(p => p.id === producto.id);
        if(idx !== -1) this.carrito[idx].cantidad++;
        else this.carrito.push({...producto, cantidad: 1});
    }

    calcularTotal() {
        return this.carrito.reduce((sum, p) => sum + (p.Precio * p.cantidad), 0);
    }

    async realizarPedido(metodoEnvioId, direccion) {
        const response = await fetch('api/pedidos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.usuario.token}`
            },
            body: JSON.stringify({
                accion: 'crearPedido',
                productos: this.carrito,
                total: this.calcularTotal(),
                direccion,
                metodoEnvioId
            })
        });
        const data = await response.json();
        if(data.success) this.carrito = [];
        return data;
    }
}

