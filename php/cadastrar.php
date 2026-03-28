<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
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
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco: ' . $e->getMessage()]);
    exit;
}

// Processar cadastro
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Receber dados
    $nome = trim($_POST['nome'] ?? '');
    $dataNasc = trim($_POST['dataNasc'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $curso = trim($_POST['curso'] ?? '');
    $endereco = trim($_POST['endereco'] ?? '');
    
    // Validações
    if (empty($nome) || empty($dataNasc) || empty($email) || empty($curso) || empty($endereco)) {
        echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios']);
        exit;
    }
    
    // Upload de foto
    $fotoNome = null;
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = dirname(__DIR__) . '/uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $extensao = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
        $permitidos = ['jpg', 'jpeg', 'png', 'gif'];
        
        if (!in_array($extensao, $permitidos)) {
            echo json_encode(['success' => false, 'message' => 'Formato de imagem não permitido']);
            exit;
        }
        
        $fotoNome = uniqid('foto_') . '.' . $extensao;
        $fotoPath = $uploadDir . $fotoNome;
        
        if (!move_uploaded_file($_FILES['foto']['tmp_name'], $fotoPath)) {
            echo json_encode(['success' => false, 'message' => 'Erro ao fazer upload da foto']);
            exit;
        }
    }
    
    // Inserir no banco - SEM incluir dataCad (será preenchida automaticamente)
    try {
        $sql = "INSERT INTO alunos (nome, dataNasc, email, curso, endereco, foto) 
                VALUES (:nome, :dataNasc, :email, :curso, :endereco, :foto)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':dataNasc', $dataNasc);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':curso', $curso);
        $stmt->bindParam(':endereco', $endereco);
        $stmt->bindParam(':foto', $fotoNome);
        
        $stmt->execute();
        
        echo json_encode([
            'success' => true, 
            'message' => 'Aluno cadastrado com sucesso!',
            'id' => $pdo->lastInsertId()
        ]);
        
    } catch (PDOException $e) {
        // Se foi erro de email duplicado
        if ($e->getCode() == 23000) {
            echo json_encode(['success' => false, 'message' => 'Este email já está cadastrado']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar: ' . $e->getMessage()]);
        }
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
}
?>


