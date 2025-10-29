<?php
header('Content-Type: application/json');

$host = "db";
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

$data = json_decode(file_get_contents('php://input'), true);
$nombre = $data['nombre'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$fecha_nacimiento = $data['fecha_nacimiento'] ?? null;

if (empty($nombre) || empty($email) || empty($password)) {
    echo json_encode(['ok' => false, 'mensaje' => 'Faltan datos obligatorios']);
    exit;
}

$password_hash = password_hash($password, PASSWORD_DEFAULT);

$checkQuery = "SELECT id_usuario FROM usuario WHERE email = $1";
$checkResult = pg_query_params($conn, $checkQuery, [$email]);

if ($checkResult && pg_num_rows($checkResult) > 0) {
    echo json_encode(['ok' => false, 'mensaje' => 'Ya existe una cuenta con ese correo electrónico.']);
    exit;
}

$query = "INSERT INTO usuario (nombre, email, rango, telefono, direccion, password_hash, fecha_nacimiento)
          VALUES ($1, $2, 'usuario', NULL, NULL, $3, $4)
          RETURNING id_usuario";

$result = pg_query_params($conn, $query, [$nombre, $email, $password_hash, $fecha_nacimiento]);

$rango = ($email === 'silvanemaberriel@gmail.com') ? 'admin' : 'usuario';

if (!$result) {
    echo json_encode([
        'ok' => false,
        'mensaje' => 'Error en INSERT: ' . pg_last_error($conn)
    ]);
    exit;
}

$usuario = pg_fetch_assoc($result);

echo json_encode([
    'ok' => true,
    'mensaje' => 'Usuario registrado correctamente',
    'usuario' => [
        'id_usuario' => $usuario['id_usuario'],
        'nombre' => $nombre,
        'email' => $email,
        'rango' => $rango
    ]
]);
?>
