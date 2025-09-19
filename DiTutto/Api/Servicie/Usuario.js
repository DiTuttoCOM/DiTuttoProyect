// usuarioService.js
class UsuarioService {
    constructor() {
        this.usuario = null;
    }

    async verificarSesion() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if (this.usuario) {
            return this.actualizarInterfazUsuario();
        }
        return false;
    }

    async registrarUsuario(datos) {
        try {
            const response = await fetch('api/usuarios.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                this.usuario = data.usuario;
                return true;
            }
            throw new Error(data.error);
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }
}