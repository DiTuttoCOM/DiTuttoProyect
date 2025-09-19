<?php
header('Content-Type: application/json');
include 'conexiones.php';
$query = "SELECT ID_producto, Nombre, Precio, Descripcion, Imagen FROM Producto";
$result = pg_query($conn, $query);

$productos = [];
if ($result) {
    while ($row = pg_fetch_assoc($result)) {
        $productos[] = [
            "id" => $row['id_producto'],
            "nombre" => $row['nombre'],
            "precio" => $row['precio'],
            "estrellas" => $row['estrellas'],
            "autor" => $row['autor'],
            "descripcion" => $row['descripcion'],
            "imagen" => $row['imagen'],
            "reportado" => $row['reportado']
        ];
    }
    echo json_encode($productos);
} else {
    echo json_encode(["error" => pg_last_error($conn)]);
}
pg_close($conn);
?>
