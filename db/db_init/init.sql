-- ========================================
-- TABLA CLIENTES
-- ========================================
CREATE TABLE Clientes (
    ID_cliente SERIAL PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    Telefono VARCHAR(20),
    Direccion VARCHAR(200),
    Fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    Password VARCHAR(100) NOT NULL,
    Fecha_nacimiento DATE
);

-- ========================================
-- TABLA PROVEEDOR
-- ========================================
CREATE TABLE Proveedor (
    ID_proveedor SERIAL PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Nombre_contacto VARCHAR(150),
    Email VARCHAR(150) UNIQUE,
    Telefono VARCHAR(20),
    Direccion VARCHAR(200),
    Fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ========================================
-- TABLA CATEGORIA
-- ========================================
CREATE TABLE Categoria (
    ID_categoria SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) UNIQUE NOT NULL
);

-- ========================================
-- TABLA PRODUCTO
-- ========================================
CREATE TABLE Producto (
    ID_producto SERIAL PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Descripcion TEXT,
    Precio NUMERIC(10,2) NOT NULL,
    Moneda VARCHAR(10) DEFAULT 'USD',
    ID_proveedor INT NOT NULL,
    ID_categoria INT,
    Estado_producto VARCHAR(30) NOT NULL,
    Descuento NUMERIC(5,2) DEFAULT 0,
    Imagen VARCHAR(255),
    Calificacion NUMERIC(3,2),
    Comentarios TEXT,
    
    CONSTRAINT fk_proveedor_producto FOREIGN KEY (ID_proveedor)
        REFERENCES Proveedor(ID_proveedor),
    CONSTRAINT fk_categoria_producto FOREIGN KEY (ID_categoria)
        REFERENCES Categoria(ID_categoria)
);

-- ========================================
-- TABLA STOCK
-- ========================================
CREATE TABLE Stock (
    ID_producto INT PRIMARY KEY,
    Cantidad_disponible INT NOT NULL,
    Ultima_actualizacion DATE NOT NULL DEFAULT CURRENT_DATE,
    
    CONSTRAINT fk_producto_stock FOREIGN KEY (ID_producto) 
        REFERENCES Producto(ID_producto)
);

-- ========================================
-- TABLA PUBLICACION
-- ========================================
CREATE TABLE Publicacion (
    ID_publicacion SERIAL PRIMARY KEY,
    ID_producto INT NOT NULL,
    ID_vendedor INT NOT NULL,
    Fecha_publicacion DATE NOT NULL DEFAULT CURRENT_DATE,
    Estado VARCHAR(30) NOT NULL,
    Descripcion TEXT NOT NULL,
    
    CONSTRAINT fk_producto_pub FOREIGN KEY (ID_producto) 
        REFERENCES Producto(ID_producto),
    CONSTRAINT fk_vendedor_pub FOREIGN KEY (ID_vendedor) 
        REFERENCES Clientes(ID_cliente)
);

-- ========================================
-- TABLA REPORTE DE PUBLICACION
-- ========================================
CREATE TABLE Reporte_Publicacion (
    ID_reporte SERIAL PRIMARY KEY,
    ID_publicacion INT NOT NULL,
    ID_usuario INT NOT NULL,
    Motivo TEXT,
    Fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    Estado VARCHAR(30) NOT NULL,
    
    CONSTRAINT fk_publicacion_reporte FOREIGN KEY (ID_publicacion) 
        REFERENCES Publicacion(ID_publicacion),
    CONSTRAINT fk_usuario_reporte FOREIGN KEY (ID_usuario) 
        REFERENCES Clientes(ID_cliente)
);

-- ========================================
-- TABLA BAN_USUARIO
-- ========================================
CREATE TABLE Ban_Usuario (
    ID_ban SERIAL PRIMARY KEY,
    ID_usuario INT NOT NULL,
    Motivo TEXT,
    Fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    Fecha_fin DATE,
    
    CONSTRAINT fk_usuario_ban FOREIGN KEY (ID_usuario) 
        REFERENCES Clientes(ID_cliente)
);

-- ========================================
-- TABLA MENSAJE
-- ========================================
CREATE TABLE Mensaje (
    ID_mensaje SERIAL PRIMARY KEY,
    ID_remitente INT NOT NULL,
    ID_destinatario INT NOT NULL,
    Contenido TEXT NOT NULL,
    Fecha_envio TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT fk_remitente FOREIGN KEY (ID_remitente) 
        REFERENCES Clientes(ID_cliente),
    CONSTRAINT fk_destinatario FOREIGN KEY (ID_destinatario) 
        REFERENCES Clientes(ID_cliente)
);

-- ========================================
-- TABLA NOTIFICACIONES
-- ========================================
CREATE TABLE Notificaciones (
    ID SERIAL PRIMARY KEY,
    ID_usuario INT,
    Tipo VARCHAR(50),
    Mensaje VARCHAR(255),
    Leido BOOLEAN DEFAULT FALSE,
    Fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_usuario_notif FOREIGN KEY (ID_usuario)
        REFERENCES Clientes(ID_cliente)
);

-- ========================================
-- TABLA METODO DE ENVIO
-- ========================================
CREATE TABLE MetodoEnvio (
    ID_envio SERIAL PRIMARY KEY,
    Nombre VARCHAR(100),
    Costo NUMERIC(10,2) DEFAULT 0,
    Tiempo_estimado VARCHAR(50)
);

-- ========================================
-- TABLA PEDIDO
-- ========================================
CREATE TABLE Pedido (
    ID_pedido SERIAL PRIMARY KEY,
    ID_cliente INT NOT NULL,
    ID_envio INT,
    Fecha_pedido DATE NOT NULL DEFAULT CURRENT_DATE,
    Fecha_resolucion DATE,
    Estado_pedido VARCHAR(30) NOT NULL,
    Direccion_envio VARCHAR(200),
    Total_pedido NUMERIC(10,2) NOT NULL,
    
    CONSTRAINT fk_cliente_pedido FOREIGN KEY (ID_cliente)
        REFERENCES Clientes(ID_cliente),
    CONSTRAINT fk_envio_pedido FOREIGN KEY (ID_envio)
        REFERENCES MetodoEnvio(ID_envio)
);

-- ========================================
-- TABLA COMPRA
-- ========================================
CREATE TABLE Compra (
    ID_pedido INT NOT NULL,
    ID_producto INT NOT NULL,
    Cantidad INT NOT NULL,
    Precio_unitario NUMERIC(10,2) NOT NULL,
    
    PRIMARY KEY (ID_pedido, ID_producto),
    
    CONSTRAINT fk_pedido_compra FOREIGN KEY (ID_pedido)
        REFERENCES Pedido(ID_pedido),
    CONSTRAINT fk_producto_compra FOREIGN KEY (ID_producto)
        REFERENCES Producto(ID_producto)
);

-- ========================================
-- TABLA CARRITO
-- ========================================
CREATE TABLE Carrito (
    ID_carrito SERIAL PRIMARY KEY,
    ID_cliente INT NOT NULL,
    Fecha_creacion DATE DEFAULT CURRENT_DATE,
    
    CONSTRAINT fk_cliente_carrito FOREIGN KEY (ID_cliente)
        REFERENCES Clientes(ID_cliente)
);

CREATE TABLE Carrito_Detalle (
    ID_carrito INT NOT NULL,
    ID_producto INT NOT NULL,
    Cantidad INT NOT NULL,
    PRIMARY KEY (ID_carrito, ID_producto),
    
    CONSTRAINT fk_carrito_detalle FOREIGN KEY (ID_carrito)
        REFERENCES Carrito(ID_carrito),
    CONSTRAINT fk_producto_detalle FOREIGN KEY (ID_producto)
        REFERENCES Producto(ID_producto)
);

-- ========================================
-- TABLA RESEÑA (CALIFICACIONES)
-- ========================================
CREATE TABLE Reseña (
    ID_reseña SERIAL PRIMARY KEY,
    ID_cliente INT NOT NULL,
    ID_producto INT NOT NULL,
    Calificacion NUMERIC(2,1) CHECK (Calificacion BETWEEN 0 AND 5),
    Comentario TEXT,
    Fecha DATE DEFAULT CURRENT_DATE,
    
    CONSTRAINT fk_cliente_reseña FOREIGN KEY (ID_cliente)
        REFERENCES Clientes(ID_cliente),
    CONSTRAINT fk_producto_reseña FOREIGN KEY (ID_producto)
        REFERENCES Producto(ID_producto)
);

-- ========================================
-- TABLA INTERACCION CON ATENCION AL CLIENTE
-- ========================================
CREATE TABLE Interaccion_Atencion (
    ID_interaccion SERIAL PRIMARY KEY,
    ID_cliente INT NOT NULL,
    Detalle_solicitud TEXT,
    Respuesta TEXT,
    Estado_solicitud VARCHAR(30),
    Fecha_interaccion DATE DEFAULT CURRENT_DATE,
    
    CONSTRAINT fk_cliente_interaccion FOREIGN KEY (ID_cliente)
        REFERENCES Clientes(ID_cliente)
);

-- ========================================
-- DATOS DE PRUEBA
-- ========================================

-- Categorías
INSERT INTO Categoria (Nombre) VALUES
('Electrónica'), ('Alimentos'), ('Hogar'), ('Juguetes'), ('Coleccionables'), ('General');

-- Clientes
INSERT INTO Clientes (Nombre, Email, Telefono, Direccion, Fecha_registro, Password, Fecha_nacimiento)
VALUES
('Juan Pérez', 'juanperez@email.com', '099123456', 'Calle Falsa 123', '2025-09-14', 'password123', '1990-05-12'),
('María Gómez', 'mariagomez@email.com', '098654321', 'Avenida Siempre Viva 456', '2025-09-12', 'securepass', '1985-11-30');

-- Proveedores
INSERT INTO Proveedor (Nombre, Nombre_contacto, Email, Telefono, Direccion, Fecha_registro)
VALUES
('Tech Supplies', 'Carlos Ruiz', 'contact@techsupplies.com', '091234567', 'Zona Industrial 12', '2025-01-01'),
('Gourmet Foods', 'Ana Torres', 'ventas@gourmetfoods.com', '092345678', 'Calle Gourmet 45', '2025-02-20');

-- Productos
INSERT INTO Producto (Nombre, Descripcion, Precio, ID_proveedor, ID_categoria, Estado_producto, Descuento, Imagen, Calificacion, Comentarios)
VALUES
('Auriculares Inalámbricos', 'Auriculares bluetooth con cancelación de ruido', 59.99, 1, 1, 'Activo', 10.00, 'auriculares.jpg', 4.5, 'Muy buenos, recomendados'),
('Caja de Chocolates Premium', 'Selección de chocolates artesanales', 24.50, 2, 2, 'Activo', 0.00, 'chocolates.jpg', 4.8, 'Deliciosos y elegantes');

-- Stock
INSERT INTO Stock (ID_producto, Cantidad_disponible, Ultima_actualizacion)
VALUES
(1, 50, '2025-09-14'),
(2, 30, '2025-09-14');

-- Publicaciones
INSERT INTO Publicacion (ID_producto, ID_vendedor, Fecha_publicacion, Estado, Descripcion)
VALUES
(1, 1, '2025-09-14', 'Activa', 'Auriculares bluetooth de alta calidad, perfecto para música y llamadas.'),
(2, 2, '2025-09-14', 'Activa', 'Caja de chocolates gourmet ideal para regalos y celebraciones.');

-- Reporte de Publicación
INSERT INTO Reporte_Publicacion (ID_publicacion, ID_usuario, Motivo, Fecha, Estado)
VALUES
(1, 2, 'Contenido engañoso', '2025-09-15', 'Pendiente');

-- Ban Usuario
INSERT INTO Ban_Usuario (ID_usuario, Motivo, Fecha_inicio, Fecha_fin)
VALUES
(2, 'Uso indebido de la plataforma', '2025-09-15', NULL);

-- Mensajes
INSERT INTO Mensaje (ID_remitente, ID_destinatario, Contenido)
VALUES
(1, 2, 'Hola, ¿te interesan los auriculares?');

-- Notificaciones
INSERT INTO Notificaciones (ID_usuario, Tipo, Mensaje)
VALUES
(2, 'carrito', 'Tienes un nuevo producto en tu carrito');

-- Método de envío
INSERT INTO MetodoEnvio (Nombre, Costo, Tiempo_estimado)
VALUES
('Standard', 5.00, '3-5 días'), ('Express', 15.00, '1-2 días');

-- Pedido
INSERT INTO Pedido (ID_cliente, ID_envio, Fecha_pedido, Estado_pedido, Direccion_envio, Total_pedido)
VALUES
(1, 1, '2025-09-15', 'Pendiente', 'Calle Falsa 123', 84.49);

-- Compra
INSERT INTO Compra (ID_pedido, ID_producto, Cantidad, Precio_unitario)
VALUES
(1, 1, 1, 59.99),
(1, 2, 1, 24.50);

-- Interacción Atención al Cliente
INSERT INTO Interaccion_Atencion (ID_cliente, Detalle_solicitud, Respuesta, Estado_solicitud, Fecha_interaccion)
VALUES
(1, 'No recibí mi pedido aún', 'Estamos revisando tu caso', 'Pendiente', '2025-09-15');