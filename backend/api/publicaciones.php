<?php
header('Content-Type: application/json');
include 'conexion.php';

$query = "SELECT id_publicacion, nombre, descripcion, precio, categoria, estado, descuento, imagen_url, calificacion FROM publicacion";
$result = pg_query($conn, $query);

if (!$result) {
    echo json_encode(["error" => pg_last_error($conn)]);
    pg_close($conn);
    exit;
}

$productos = [];
while ($row = pg_fetch_assoc($result)) {
    $productos[] = $row;
}

echo json_encode($productos);

pg_close($conn);
?>
