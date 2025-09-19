<?php
$host = "db";
$port = "5432";
$dbname = "mibase";  // nombre de la DB del docker-compose
$user = "usuario";    // usuario del docker-compose
$password = "contraseña";  // contraseña del docker-compose

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");
if (!$conn) {
    die(json_encode(["error" => "Error de conexión: " . pg_last_error()]));
}
?>
