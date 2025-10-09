CREATE TABLE usuario (
  id_usuario       SERIAL PRIMARY KEY,
  nombre           TEXT NOT NULL,
  email            TEXT UNIQUE NOT NULL,
  rango            TEXT,
  telefono         TEXT,
  direccion        TEXT,
  fecha_registro   TIMESTAMPTZ DEFAULT now(),
  password_hash    TEXT,
  fecha_nacimiento DATE
);

CREATE TABLE publicacion (
  id_publicacion   SERIAL PRIMARY KEY,
  nombre           TEXT NOT NULL,
  descripcion      TEXT,
  precio           NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  categoria        TEXT,
  estado           TEXT,
  descuento        NUMERIC(5,2) DEFAULT 0.00,
  imagen_url       TEXT,
  calificacion     NUMERIC(3,2)
);

CREATE TABLE comentarios (
  id_comentario  SERIAL PRIMARY KEY,
  id_publicacion INT NOT NULL,
  id_usuario     INT NOT NULL,
  contenido      TEXT,
  estrellas      INT CHECK (estrellas BETWEEN 1 AND 5),
  fecha          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE pedidos (
  id_pedido        SERIAL PRIMARY KEY,
  id_cliente       INTEGER REFERENCES usuario(id_usuario) ON DELETE SET NULL,
  fecha_pedido     TIMESTAMPTZ DEFAULT now(),
  estado_pedido    TEXT,
  total_pedido     NUMERIC(12,2) DEFAULT 0.00,
  direccion_envio  TEXT
);

CREATE TABLE detalle_pedido (
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
