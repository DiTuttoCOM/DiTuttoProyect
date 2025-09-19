// pedidoService.js
class PedidoService {
    constructor() {
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    }

    async agregarAlCarrito(producto) {
        const idx = this.carrito.findIndex(p => p.id === producto.id);
        if (idx !== -1) {
            this.carrito[idx].cantidad = (this.carrito[idx].cantidad || 1) + 1;
        } else {
            this.carrito.push({ ...producto, cantidad: 1 });
        }
        await this.guardarCarrito();
    }

    async realizarPedido() {
        if (this.carrito.length === 0) {
            throw new Error('El carrito está vacío');
        }

        try {
            const response = await fetch('api/pedidos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usuario.token}`
                },
                body: JSON.stringify({
                    productos: this.carrito,
                    total: this.calcularTotal()
                })
            });

            const data = await response.json();
            if (data.success) {
                this.carrito = [];
                localStorage.removeItem('carrito');
                return data.pedido;
            }
            throw new Error(data.error);
        } catch (error) {
            console.error('Error realizando el pedido:', error);
            throw error;
        }
    }
}