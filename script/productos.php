<?php
header('Content-Type: application/json');
include_once '../script/conexiones.php';

$input = json_decode(file_get_contents('php://input'), true);
$accion = $input['accion'] ?? 'obtenerProductos';

// ✅ OBTENER PRODUCTO POR ID
if ($accion === 'obtenerProducto' && isset($input['id'])) {
    $id = intval($input['id']);
    $query = "
        SELECT 
            p.ID_producto AS id,
            p.Nombre AS nombre,
            p.Precio AS precio,
            p.Calificacion AS estrellas,
            c.Nombre AS autor,
            p.Descripcion AS descripcion,
            p.Imagen AS imagen
        FROM Producto p
        JOIN Publicacion pub ON pub.ID_producto = p.ID_producto
        JOIN Clientes c ON pub.ID_vendedor = c.ID_cliente
        WHERE p.ID_producto = $1
        LIMIT 1
    ";
    $result = pg_query_params($conn, $query, [$id]);
    if ($row = pg_fetch_assoc($result)) {
        echo json_encode(["success" => true, "producto" => $row]);
    } else {
        echo json_encode(["success" => false, "error" => "Producto no encontrado"]);
    }
    pg_close($conn);
    exit;
}

// ✅ OBTENER TODOS LOS PRODUCTOS
$query = "
    SELECT 
        p.ID_producto AS id,
        p.Nombre AS nombre,
        p.Precio AS precio,
        p.Calificacion AS estrellas,
        c.Nombre AS autor,
        p.Descripcion AS descripcion,
        p.Imagen AS imagen
    FROM Producto p
    JOIN Publicacion pub ON pub.ID_producto = p.ID_producto
    JOIN Clientes c ON pub.ID_vendedor = c.ID_cliente
";
$result = pg_query($conn, $query);

$productos = [];
if ($result) {
    while ($row = pg_fetch_assoc($result)) {
        $productos[] = $row;
    }
    echo json_encode(["success" => true, "productos" => $productos]);
} else {
    echo json_encode(["success" => false, "error" => "No se pudieron cargar productos"]);
}

pg_close($conn);
?>