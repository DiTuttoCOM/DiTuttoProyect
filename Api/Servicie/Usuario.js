// usuarioService.js
class UsuarioService {
async registrarUsuario(datos) {
        try {
            const response = await fetch('api/usuarios.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accion: 'registrar', datos })
            });
            const data = await response.json();
            if (data.success && data.usuario) {
                this.usuario = data.usuario; // guarda solo en memoria
                return true;
            }
            throw new Error(data.error || 'Error desconocido al registrar');
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    // Función para actualizar la UI según usuario logueado
    actualizarInterfazUsuario() {
        const btnCuenta = document.querySelector('.btnCuenta');
        if (!btnCuenta || !this.usuario) return;

        const nuevoBtn = document.createElement('a');
        nuevoBtn.href = this.usuario.rango === 'admin' ? 'admin.html' : 'ajustes.html';
        nuevoBtn.textContent = this.usuario.rango === 'admin' ? '🛠️' : '⚙️';
        nuevoBtn.classList.add('btn', 'btn-light', 'rounded-pill', 'px-3');
        btnCuenta.replaceWith(nuevoBtn);
    }
}
