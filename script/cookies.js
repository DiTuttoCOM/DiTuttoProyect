export function setCookie(nombre, valor, dias) {
    const fecha = new Date();
    fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
    const expiracion = "expires=" + fecha.toUTCString();
    document.cookie = `${nombre}=${valor};${expiracion};path=/`;
}

export function getCookie(nombre) {
    const nombreEQ = nombre + "=";
    const cookiesArray = document.cookie.split(';');
    for (let c of cookiesArray) {
        c = c.trim();
        if (c.indexOf(nombreEQ) === 0) return c.substring(nombreEQ.length);
    }
    return null;
}

export function borrarCookie(nombre) {
    setCookie(nombre, '', -1);
}
