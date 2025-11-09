<?php
header('Content-Type: application/json');

$host = "ditutto_db";
$port = "5432";
$dbname = "DiTutto";
$user = "utu";
$password = "12345678";

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$conn) {
    echo json_encode([
        'ok' => false,
        'mensaje' => 'Error de conexión con la base de datos: ' . pg_last_error()
    ]);
    exit;
}
?>
