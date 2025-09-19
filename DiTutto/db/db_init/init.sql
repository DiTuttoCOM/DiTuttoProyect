
CREATE TABLE Clientes (
    ID_cliente SERIAL PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    Telefono VARCHAR(20),
    Direccion VARCHAR(200),
    Fecha_registro DATE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Fecha_nacimiento DATE
);

CREATE TABLE Proveedor (
    ID_proveedor SERIAL PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Nombre_contacto VARCHAR(150),
    Email VARCHAR(150) UNIQUE,
    Telefono VARCHAR(20),
    Direccion VARCHAR(200),
    Fecha_registro DATE NOT NULL
);

CREATE TABLE Producto (
    ID_producto SERIAL PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Descripcion TEXT,
    Precio NUMERIC(10,2) NOT NULL,
    ID_proveedor INT NOT NULL,
    Categoria VARCHAR(100),
    Estado_producto VARCHAR(30) NOT NULL,
    Descuento NUMERIC(5,2) DEFAULT 0,
    Imagen VARCHAR(255),
    Calificacion NUMERIC(3,2),
    Comentarios TEXT,
    
    CONSTRAINT fk_proveedor_producto FOREIGN KEY (ID_proveedor)
        REFERENCES Proveedor(ID_proveedor)
);

CREATE TABLE Stock (
    ID_producto INT PRIMARY KEY,
    Cantidad_disponible INT NOT NULL,
    Ultima_actualizacion DATE NOT NULL,
    
    CONSTRAINT fk_producto_stock FOREIGN KEY (ID_producto) 
        REFERENCES Producto(ID_producto)
);


CREATE TABLE Publicacion (
    ID_publicacion SERIAL PRIMARY KEY,
    ID_producto INT NOT NULL,
    ID_vendedor INT NOT NULL,
    Fecha_publicacion DATE NOT NULL,
    Estado VARCHAR(30) NOT NULL,
    Descripcion TEXT,
    
    CONSTRAINT fk_producto_pub FOREIGN KEY (ID_producto) 
        REFERENCES Producto(ID_producto),
    CONSTRAINT fk_vendedor_pub FOREIGN KEY (ID_vendedor) 
        REFERENCES Clientes(ID_cliente)
);

CREATE TABLE Reporte_Publicacion (
    ID_reporte SERIAL PRIMARY KEY,
    ID_publicacion INT NOT NULL,
    ID_usuario INT NOT NULL,
    Motivo TEXT,
    Fecha DATE NOT NULL,
    Estado VARCHAR(30) NOT NULL,
    
    CONSTRAINT fk_publicacion_reporte FOREIGN KEY (ID_publicacion) 
        REFERENCES Publicacion(ID_publicacion),
    CONSTRAINT fk_usuario_reporte FOREIGN KEY (ID_usuario) 
        REFERENCES Clientes(ID_cliente)
);

CREATE TABLE Ban_Usuario (
    ID_ban SERIAL PRIMARY KEY,
    ID_usuario INT NOT NULL,
    Motivo TEXT,
    Fecha_inicio DATE NOT NULL,
    Fecha_fin DATE,
    
    CONSTRAINT fk_usuario_ban FOREIGN KEY (ID_usuario) 
        REFERENCES Clientes(ID_cliente)
);


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

CREATE TABLE Notificaciones (
    ID SERIAL PRIMARY KEY,
    ID_usuario INT, -- a quién va dirigida la notificación (null si es admin general)
    Tipo VARCHAR(50), -- ejemplo: 'carrito', 'reportado'
    Mensaje VARCHAR(255),
    Leido BOOLEAN DEFAULT FALSE, -- true = leído, false = no leído
    Fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_usuario_notif FOREIGN KEY (ID_usuario)
        REFERENCES Clientes(ID_cliente)
);


CREATE TABLE Pedido (
    ID_pedido SERIAL PRIMARY KEY,
    ID_cliente INT NOT NULL,
    Fecha_pedido DATE NOT NULL,
    Fecha_resolucion DATE,
    Estado_pedido VARCHAR(30) NOT NULL, -- pendiente, enviado, completado, cancelado
    Direccion_envio VARCHAR(200),
    Total_pedido NUMERIC(10,2) NOT NULL,
    
    CONSTRAINT fk_cliente_pedido FOREIGN KEY (ID_cliente)
        REFERENCES Clientes(ID_cliente)
);

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


CREATE TABLE Interaccion_Atencion (
    ID_interaccion SERIAL PRIMARY KEY,
    ID_cliente INT NOT NULL,
    Detalle_solicitud TEXT,
    Respuesta TEXT,
    Estado_solicitud VARCHAR(30),
    Fecha_interaccion DATE,
    
    CONSTRAINT fk_cliente_interaccion FOREIGN KEY (ID_cliente)
        REFERENCES Clientes(ID_cliente)
);

-- ========================
-- INSERTS
-- ========================

INSERT INTO Clientes (Nombre, Email, Telefono, Direccion, Fecha_registro, Password, Fecha_nacimiento)
VALUES
('Juan Pérez', 'juanperez@email.com', '099123456', 'Calle Falsa 123', '2025-09-14', 'password123', '1990-05-12'),
('María Gómez', 'mariagomez@email.com', '098654321', 'Avenida Siempre Viva 456', '2025-09-12', 'securepass', '1985-11-30');

INSERT INTO Proveedor (Nombre, Nombre_contacto, Email, Telefono, Direccion, Fecha_registro)
VALUES
('Tech Supplies', 'Carlos Ruiz', 'contact@techsupplies.com', '091234567', 'Zona Industrial 12', '2025-01-01'),
('Gourmet Foods', 'Ana Torres', 'ventas@gourmetfoods.com', '092345678', 'Calle Gourmet 45', '2025-02-20');

INSERT INTO Producto (Nombre, Descripcion, Precio, ID_proveedor, Categoria, Estado_producto, Descuento, Imagen, Calificacion, Comentarios)
VALUES
('Auriculares Inalámbricos', 'Auriculares bluetooth con cancelación de ruido', 59.99, 1, 'Electrónica', 'Activo', 10.00, 'auriculares.jpg', 4.5, 'Muy buenos, recomendados'),
('Caja de Chocolates Premium', 'Selección de chocolates artesanales', 24.50, 2, 'Alimentos', 'Activo', 0.00, 'chocolates.jpg', 4.8, 'Deliciosos y elegantes');

INSERT INTO Stock (ID_producto, Cantidad_disponible, Ultima_actualizacion)
VALUES
(1, 50, '2025-09-14'),
(2, 30, '2025-09-14');

INSERT INTO Publicacion (ID_producto, ID_vendedor, Fecha_publicacion, Estado, Descripcion)
VALUES
(1, 1, '2025-09-14', 'Activa', 'Auriculares bluetooth de alta calidad, perfecto para música y llamadas.'),
(2, 2, '2025-09-14', 'Activa', 'Caja de chocolates gourmet ideal para regalos y celebraciones.');

INSERT INTO Reporte_Publicacion (ID_publicacion, ID_usuario, Motivo, Fecha, Estado)
VALUES
(1, 2, 'Contenido engañoso', '2025-09-15', 'Pendiente');

INSERT INTO Ban_Usuario (ID_usuario, Motivo, Fecha_inicio, Fecha_fin)
VALUES
(2, 'Uso indebido de la plataforma', '2025-09-15', NULL);

INSERT INTO Mensaje (ID_remitente, ID_destinatario, Contenido)
VALUES
(1, 2, 'Hola, ¿te interesan los auriculares?');

INSERT INTO Notificaciones (ID_usuario, Tipo, Mensaje)
VALUES
(2, 'carrito', 'Tienes un nuevo producto en tu carrito');

INSERT INTO Pedido (ID_cliente, Fecha_pedido, Estado_pedido, Direccion_envio, Total_pedido)
VALUES
(1, '2025-09-15', 'Pendiente', 'Calle Falsa 123', 84.49);

INSERT INTO Compra (ID_pedido, ID_producto, Cantidad, Precio_unitario)
VALUES
(1, 1, 1, 59.99),
(1, 2, 1, 24.50);

INSERT INTO Interaccion_Atencion (ID_cliente, Detalle_solicitud, Respuesta, Estado_solicitud, Fecha_interaccion)
VALUES
(1, 'No recibí mi pedido aún', 'Estamos revisando tu caso', 'Pendiente', '2025-09-15');