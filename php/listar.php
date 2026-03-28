<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Conexão com banco de dados
$host = 'localhost';
$dbname = 'cadastroalunos';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Erro na conexão com o banco: ' . $e->getMessage()
    ]);
    exit;
}

// Buscar aluno específico por ID
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    
    try {
        $sql = "SELECT * FROM alunos WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        $aluno = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($aluno) {
            echo json_encode([
                'success' => true,
                'data' => $aluno
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Aluno não encontrado'
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao buscar aluno: ' . $e->getMessage()
        ]);
    }
    
} else {
    // Listar todos os alunos
    try {
        $sql = "SELECT * FROM alunos ORDER BY id DESC";
        $stmt = $pdo->query($sql);
        $alunos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $alunos,
            'total' => count($alunos)
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao listar alunos: ' . $e->getMessage()
        ]);
    }
}
?>

