<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['nombre'], $data['precio'])) {
    echo json_encode(['exito' => false, 'mensaje' => 'Datos incompletos']);
    exit;
}

require 'conexion.php';

$nombre = $data['nombre'];
$descripcion = isset($data['descripcion']) ? $data['descripcion'] : '';
$precio = $data['precio'];
$imagen_url = isset($data['imagen']) ? $data['imagen'] : null;

$calificacion = 5.00;

$query = "INSERT INTO publicacion (nombre, descripcion, precio, imagen_url, calificacion) VALUES ($1, $2, $3, $4, $5)";
$result = pg_query_params($conn, $query, [$nombre, $descripcion, $precio, $imagen_url, $calificacion]);

if ($result) {
    echo json_encode(['exito' => true]);
} else {
    echo json_encode(['exito' => false, 'mensaje' => pg_last_error($conn)]);
}
?>
