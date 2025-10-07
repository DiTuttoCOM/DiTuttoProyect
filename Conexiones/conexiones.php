<?php
$host = "localhost";
$port = "8081:80";
$dbname = "DiTutto";
$user = "utu";
$password = "12345678";

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$conn) {
    die("Error de conexión: " . pg_last_error());
}
echo "Conexión exitosa!";
?>