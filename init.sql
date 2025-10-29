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

CREATE TABLE IF NOT EXISTS imagenes_publicacion (
  id_imagen        SERIAL   AUTO INCREMENT  PRIMARY KEY,
  id_publicacion   INT  AUTO INCREMENT  NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  imagen LONGBLOB,
  fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP
  FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CreadorPublicacion(
  id_usuario     INT  AUTO INCREMENT NOT NULL,
  id_publicacion INT  AUTO INCREMENT NOT NULL,
  PRIMARY KEY (id_usuario, id_publicacion),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion) ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS comentarios (
  id_comentario  SERIAL   AUTO INCREMENT  PRIMARY KEY,
  contenido      TEXT,
  estrellas      INT CHECK (estrellas BETWEEN 1 AND 5),
  fecha          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE IF NOT EXISTS ComentariosPublicacion(
  id_comentario  INT  AUTO INCREMENT  NOT NULL,
  id_publicacion INT  AUTO INCREMENT  NOT NULL,
  PRIMARY KEY (id_comentario, id_publicacion),
  FOREIGN KEY (id_comentario) REFERENCES comentarios(id_comentario) ON DELETE CASCADE,
  FOREIGN KEY (id_publicacion) REFERENCES publicacion(id_publicacion) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedidos (
  id_pedido        SERIAL   AUTO INCREMENT  PRIMARY KEY,
  id_cliente       INTEGER  AUTO INCREMENT,
  fecha_pedido     TIMESTAMPTZ DEFAULT now(),
  estado_pedido    TEXT,
  total_pedido     NUMERIC(12,2) DEFAULT 0.00,
  direccion_envio  TEXT,
  FOREIGN KEY (id_cliente) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
  id_detalle       SERIAL   AUTO INCREMENT  PRIMARY KEY,
  id_pedido        INTEGER  AUTO INCREMENT,
  id_producto      INTEGER  AUTO INCREMENT,
  cantidad         INTEGER NOT NULL DEFAULT 1,
  precio_unitario  NUMERIC(10,2) NOT NULL,
  descuento_item   NUMERIC(5,2) DEFAULT 0.00,
  subtotal         NUMERIC(12,2) GENERATED ALWAYS AS (cantidad * (precio_unitario - COALESCE(descuento_item,0))) STORED,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES publicacion(id_publicacion) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Chatbot(
  id_chatbot       SERIAL   AUTO INCREMENT  PRIMARY KEY,
  id_cliente       INTEGER  AUTO INCREMENT,,
  FOREIGN KEY (id_cliente) REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS MensajesChatbot(
  id_mensaje       SERIAL   AUTO INCREMENT  PRIMARY KEY,
  id_chatbot       INTEGER  AUTO INCREMENT,
  mensaje          TEXT,
  timestamp        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_chatbot) REFERENCES Chatbot(id_chatbot) ON DELETE CASCADE
);

CREATE INDEX idx_pedidos_cliente ON pedidos(id_cliente);
CREATE INDEX idx_detalle_pedido_pedido ON detalle_pedido(id_pedido);

ALTER TABLE detalle_pedido
  ADD CONSTRAINT chk_cantidad_positive CHECK (cantidad > 0);

INSERT INTO publicacion (id_publicacion, nombre, descripcion, precio, imagen_url, calificacion)
VALUES
(1, 'PC Gamer Ultra', 'PC de alto rendimiento con RTX 4070 y Ryzen 7', 1000, 'styless/img/producto1.webp', 4),
(2, 'Licuadora', 'Licuadora de alta potencia y fácil limpieza', 350, 'styless/img/producto2.webp', 4),
(3, 'Auriculares Azules', 'Bluetooth 5.3, azul, JBL', 80, 'styless/img/producto3.webp', 2),
(4, 'Pistola de portales', 'Pistoliñia de portaliñios', 45, 'styless/img/producto4.webp', 4),
(5, 'Rastreador de las esferas del dragon"', 'Rastreador de las esferas del dragon', 500, 'styless/img/producto5.webp', 4),
(6, 'Peluche de Vaporeon', 'POKEMON!!!!', 500, 'styless/img/producto6.webp', 2),
(7, 'Camisa', 'Talle M, color dorado,', 500, 'styless/img/producto7.webp', 1),
(8, 'Casita de jugetes', 'De Matel', 60, 'styless/img/producto8.webp', 4),
(9, 'Sapo Toto', 'Maxima divercion.', 500.00, 'styless/img/producto9.jpg', 1),
(10, 'Collar Deadpool 3', 'Collares de la pelicula Deadpool 3 en fomra de corazon.', 500.00, 'styless/img/producto10.webp', 1);




INSERT INTO usuario (id_usuario, nombre, email, rango, telefono, direccion, fecha_nacimiento) VALUES
(1, 'Silvano Berriel', 'gmail@gmail.com', 'admin', '+598094899340', 'AV. Brasil 151, San José, Uruguay', 'hash1', '2007-11-21'),
(2, 'Guido Bentancor', 'benancorguido@gmail.com', 'admin', '+598123456789', 'Bentancur 787, San José, Uruguay', 'hash2', '2008-06-15'),
(3, 'Lissandro García', 'carlos.lopez@example.com', 'admin', '+598888777666', 'Que te importa, San José, Uruguay', 'hash3', '2007-03-22'),
(4, 'María González', 'maria.gonzalez@example.com', 'usuario','+59844444444', 'La pampa, San José, Uruguay', 'hash4', '2009-07-10'),
(5, 'Javier Martínez', 'javier.martinez@example.com', 'usuario', '+59899999999', 'Con tu mami, San José, Uruguay', 'hash5', '1999-12-05');
(6,  'Ana Pérez','ana.perez@example.com','usuario', '+59891234567','Calle Falsa 123, Montevideo, Uruguay','1995-04-02'),
(7,  'Martín López','martin.lopez@example.com','usuario', '+59890123456','Rbla. República 456, Montevideo, Uruguay','1990-08-19'),
(8,  'Sofía Ramírez','sofia.ramirez@example.com','usuario', '+59893456789','Julio Herrera y Reissig 88, San José, Uruguay','hash8',  '2002-01-30'),
(9,  'Tomás Fernández','tomas.fernandez@example.com','usuario','+59898765432','Libertad 250, San José, Uruguay','hash9',  '1987-11-11'),
(10, 'Lucía Duarte','lucia.duarte@example.com','usuario', '+59892233445','Avenida Italia 999, Montevideo, Uruguay','hash10', '1998-05-25');

INSERT INTO imagenes_publicacion (id_publicacion, titulo, descripcion, imagen)
VALUES
(1, 'Imagen 1', 'Descripción de ejemplo 1', 'styless/img/producto1.webp'),
(2, 'Imagen 2', 'Descripción de ejemplo 2', 'styless/img/producto2.webp'),
(3, 'Imagen 3', 'Descripción de ejemplo 3', 'styless/img/producto3.webp'),
(4, 'Imagen 4', 'Descripción de ejemplo 4', 'styless/img/producto4.webp'),
(5, 'Imagen 5', 'Descripción de ejemplo 5', 'styless/img/producto5.webp'),
(6, 'Imagen 6', 'Descripción de ejemplo 6', 'styless/img/producto6.webp'),
(7, 'Imagen 7', 'Descripción de ejemplo 7', 'styless/img/producto7.webp'),
(8, 'Imagen 8', 'Descripción de ejemplo 8', 'styless/img/producto8.webp'),
(9, 'Imagen 9', 'Descripción de ejemplo 9', 'styless/img/producto9.jpg'),
(10, 'Imagen 10', 'Descripción de ejemplo 10', 'styless/img/producto10.webp');

INSERT INTO CreadorPublicacion (id_usuario, id_publicacion) VALUES
(1, 1), (1, 2), (2, 3), (3, 4), (3, 5),
(4, 6), (5, 7), (6, 8), (7, 9), (8, 10);

INSERT INTO comentarios (contenido, estrellas) VALUES
('Muy buen producto', 5),
('Llegó un poco tarde pero funciona bien', 4),
('No era lo que esperaba', 2),
('Excelente atención', 5),
('Podría mejorar el empaque', 3),
('Perfecto para su precio', 5),
('Mala calidad', 1),
('Funciona correctamente', 4),
('Recomendado', 5),
('Cumple lo prometido', 4);

INSERT INTO ComentariosPublicacion (id_comentario, id_publicacion) VALUES
(1, 1), (2, 1), (3, 2), (4, 2), (5, 3),
(6, 4), (7, 5), (8, 6), (9, 7), (10, 8);

INSERT INTO pedidos (id_cliente, estado_pedido, total_pedido, direccion_envio) VALUES
(1, 'Pendiente', 250.00, 'Av. Brasil 151, San José'),
(2, 'En camino', 450.50, 'Bentancur 787, San José'),
(3, 'Entregado', 120.00, 'Que te importa, San José'),
(4, 'Cancelado', 0.00, 'La pampa, San José'),
(5, 'Pendiente', 560.30, 'Con tu mami, San José'),
(6, 'Entregado', 98.99, 'Calle Falsa 123, Montevideo'),
(7, 'Pendiente', 349.00, 'Rbla República 456, Montevideo'),
(8, 'En camino', 777.77, 'Julio Herrera 88, San José'),
(9, 'Pendiente', 150.00, 'Libertad 250, San José'),
(10, 'Entregado', 999.99, 'Avenida Italia 999, Montevideo');

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, descuento_item) VALUES
(1, 1, 2, 100.00, 0.00),
(2, 2, 1, 450.50, 0.00),
(3, 3, 1, 120.00, 0.00),
(4, 4, 1, 0.00, 0.00),
(5, 5, 2, 280.15, 0.00),
(6, 6, 1, 98.99, 0.00),
(7, 7, 1, 349.00, 0.00),
(8, 8, 3, 259.26, 10.00),
(9, 9, 1, 150.00, 0.00),
(10, 10, 1, 999.99, 0.00);

INSERT INTO Chatbot (id_cliente) VALUES
(1),(2),(3),(4),(5),(6),(7),(8),(9),(10);

INSERT INTO MensajesChatbot (id_chatbot, mensaje) VALUES
(1, 'Como compro?'),
(2, 'Como publico mis productos?'),
(2, 'Necesito ayuda con mi cuenta.'),
(3, 'Como rastreo mi pedido?'),
(3, 'Quiero cambiar mi dirección de envío.'),
(4, 'Tienen descuentos disponibles?'),
(5, '¿Dónde puedo ver el estado de mi pedido?'),
(5, 'Puedes ver el estado de tu pedido en la sección "Mis Pedidos" dentro de tu cuenta. Ahí encontrarás información actualizada sobre cada uno de tus pedidos.'),
(6, '¿Puedo devolver un producto?'),
(7, 'Nuestra política de devoluciones permite devolver productos dentro de los 7 días posteriores a la compra, siempre que estén en su estado original y con el recibo de compra.'),
(8, '¿Cómo puedo contactar al soporte técnico?'),
(8, 'No puedo acceder a mi cuenta.'),
(9, 'No funciona.'),;
(10,'Nesesito ayuda con mi compra.');,

