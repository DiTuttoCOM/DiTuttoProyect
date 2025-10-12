// backend/api/crear_publicacion.php
<?php
header('Content-Type: application/json');

// Conexión directa
$host = "db";
$port = "5432";
$dbname = "DiTutto";
$user = "utu";
$password = "12345678";

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$conn) {
    echo json_encode(['ok' => false, 'mensaje' => 'Error al conectar con la base de datos.']);
    exit;
}

// Obtener datos de la publicación
$data = json_decode(file_get_contents("php://input"), true);

$id_usuario = $data['id_usuario'] ?? null;
$nombre = trim($data['nombre'] ?? '');
$precio = floatval($data['precio'] ?? 0);
$descripcion = trim($data['descripcion'] ?? '');
$imagen_url = trim($data['imagen_url'] ?? '');

if (!$id_usuario || !$nombre || !$precio || !$imagen_url) {
    echo json_encode(['ok' => false, 'mensaje' => 'Faltan datos obligatorios.']);
    exit;
}

if ($descripcion === '') $descripcion = 'Sin descripción.';

// Insertar en la DB
$query = "INSERT INTO publicacion (nombre, descripcion, precio, imagen_url, id_usuario) 
          VALUES ($1, $2, $3, $4, $5) RETURNING *";

$result = pg_query_params($conn, $query, [$nombre, $descripcion, $precio, $imagen_url, $id_usuario]);

if (!$result) {
    echo json_encode(['ok' => false, 'mensaje' => 'Error al guardar la publicación: ' . pg_last_error($conn)]);
    exit;
}

$publicacion = pg_fetch_assoc($result);

echo json_encode([
    'ok' => true,
    'mensaje' => 'Publicación creada con éxito.',
    'publicacion' => $publicacion
]);
?>
