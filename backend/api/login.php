<?php
header('Content-Type: application/json');

// Conexión directa (sin include)
$host = "db";
$port = "5432";
$dbname = "DiTutto";
$user = "utu";
$password = "12345678";

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$conn) {
    echo json_encode([
        'ok' => false,
        'mensaje' => 'Error de conexión con la base de datos.'
    ]);
    exit;
}

// Obtener datos del login
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$contrasena = trim($data['contrasena'] ?? '');

if (empty($email) || empty($contrasena)) {
    echo json_encode(['ok' => false, 'mensaje' => 'Debe completar todos los campos.']);
    exit;
}

// Buscar usuario por email
$query = "SELECT * FROM usuario WHERE email = $1";
$result = pg_query_params($conn, $query, [$email]);

if (!$result || pg_num_rows($result) === 0) {
    echo json_encode(['ok' => false, 'mensaje' => 'No existe una cuenta con ese email.']);
    exit;
}

$usuario = pg_fetch_assoc($result);

// Verificar contraseña usando password_verify
if (!password_verify($contrasena, $usuario['password_hash'])) {
    echo json_encode(['ok' => false, 'mensaje' => 'Contraseña incorrecta.']);
    exit;
}

// Login correcto: devolver datos completos para localStorage
echo json_encode([
    'ok' => true,
    'mensaje' => 'Inicio de sesión exitoso.',
    'usuario' => [
        'id_usuario' => $usuario['id_usuario'],
        'nombre' => $usuario['nombre'],
        'email' => $usuario['email'],
        'rango' => $usuario['rango'],
        'password_hash' => $usuario['password_hash']
    ]
]);
?>
