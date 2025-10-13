CREATE TABLE IF NOT EXISTS usuario (
  id_usuario       SERIAL PRIMARY KEY,
  nombre           TEXT NOT NULL,
  email            TEXT UNIQUE NOT NULL,
  rango            TEXT,
  telefono         TEXT,
  direccion        TEXT,
  password_hash    TEXT,
  fecha_nacimiento DATE
);

CREATE TABLE IF NOT EXISTS publicacion (
  id_publicacion   SERIAL PRIMARY KEY,
  nombre           TEXT NOT NULL,
  descripcion      TEXT,
  precio           NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  imagen_url       TEXT,
  calificacion     NUMERIC(3,2)
);

CREATE TABLE IF NOT EXISTS comentarios (
  id_comentario  SERIAL PRIMARY KEY,
  id_publicacion INT NOT NULL,
  id_usuario     INT NOT NULL,
  contenido      TEXT,
  estrellas      INT CHECK (estrellas BETWEEN 1 AND 5),
  fecha          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedidos (
  id_pedido        SERIAL PRIMARY KEY,
  id_cliente       INTEGER REFERENCES usuario(id_usuario) ON DELETE SET NULL,
  fecha_pedido     TIMESTAMPTZ DEFAULT now(),
  estado_pedido    TEXT,
  total_pedido     NUMERIC(12,2) DEFAULT 0.00,
  direccion_envio  TEXT
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
  id_detalle       SERIAL PRIMARY KEY,
  id_pedido        INTEGER NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
  id_producto      INTEGER NOT NULL REFERENCES publicacion(id_publicacion) ON DELETE RESTRICT,
  cantidad         INTEGER NOT NULL DEFAULT 1,
  precio_unitario  NUMERIC(10,2) NOT NULL,
  descuento_item   NUMERIC(5,2) DEFAULT 0.00,
  subtotal         NUMERIC(12,2) GENERATED ALWAYS AS (cantidad * (precio_unitario - COALESCE(descuento_item,0))) STORED
);

CREATE INDEX idx_pedidos_cliente ON pedidos(id_cliente);
CREATE INDEX idx_detalle_pedido_pedido ON detalle_pedido(id_pedido);

ALTER TABLE detalle_pedido
  ADD CONSTRAINT chk_cantidad_positive CHECK (cantidad > 0);

INSERT INTO publicacion (id_publicacion, nombre, descripcion, precio, imagen_url, calificacion)
VALUES
(1, 'PC Gamer Ultra', 'PC de alto rendimiento con RTX 4070 y Ryzen 7', 1000, 'styless/img/producto1.webp', 4),
(2, 'Licuadora', 'Licuadora de alta potencia y fácil limpieza', 350, 'styless/img/producto2.webp', 4),
(3, 'Inodoro gamer', 'Bluetooth 5.3', 80, 'styless/img/producto3.webp', 2),
(4, 'Pistola de portales', 'Pistoliñia de portaliñios', 45, 'styless/img/producto4.webp', 4),
(5, 'Rastreador de las esferas del dragon"', 'Rastreador de las esferas del dragon', 500, 'styless/img/producto5.webp', 4),
(6, 'Peluche de Vaporeon', 'POKEMON!!!!', 500, 'styless/img/producto6.webp', 2),
(7, 'Bomba atoica', 'Monitor curvo 144Hz QHD', 500.00, 'styless/img/producto7.webp', 1);


INSERT INTO usuario (id_usuario, nombre, email, rango, telefono, direccion, password_hash, fecha_nacimiento) VALUES
(1, 'Silvano Berriel', 'gmail@gmail.com', 'admin', '+598094899340', 'AV. Brasil 151, San José, Uruguay', 'hash1', '2007-11-21'),
(2, 'Guido Bentancor', 'benancorguido@gmail.com', 'admin', '+598123456789', 'Bentancur 787, San José, Uruguay', 'hash2', '2008-06-15'),
(3, 'Lissandro García', 'carlos.lopez@example.com', 'moderador', '+598888777666', 'Que te importa, San José, Uruguay', 'hash3', '2007-03-22'),
(4, 'María González', 'maria.gonzalez@example.com', 'usuario', '', 'La pampa, San José, Uruguay', 'hash4', '2009-07-10'),
(5, 'Javier Martínez', 'javier.martinez@example.com', 'usuario', '+', 'Con tu mami, San José, Uruguay', 'hash5', '1999-12-05');
