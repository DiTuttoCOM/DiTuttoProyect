<?php
header('Content-Type: application/json');

$host = "db";
$port = "5432";
$dbname = "mibase";
$user = "usuario";
$password = "contraseña";

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");
if (!$conn) {
    echo json_encode(["success" => false, "error" => "Error de conexión: " . pg_last_error()]);
    exit;
}

// PRUEBA: consulta simple
$result = pg_query($conn, "SELECT NOW() as fecha_actual");
if ($result) {
    $row = pg_fetch_assoc($result);
    echo json_encode(["success" => true, "fecha_actual" => $row["fecha_actual"]]);
} else {
    echo json_encode(["success" => false, "error" => pg_last_error($conn)]);
}
?>
