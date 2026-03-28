<?php
require_once 'conexao.php';

// Receber dados JSON
$dados = json_decode(file_get_contents('php://input'), true);

// Validar dados
if (!$dados || !isset($dados['nome']) || !isset($dados['email'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Dados incompletos!'
    ]);
    exit();
}

$conn = getConexao();

// Preparar SQL
$sql = "INSERT INTO alunos (nome, dataNasc, email, endereco, curso) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sssss', 
    $dados['nome'], 
    $dados['dataNasc'], 
    $dados['email'], 
    $dados['endereco'], 
    $dados['curso']
);

// Executar
if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Aluno cadastrado com sucesso!',
        'id' => $conn->insert_id
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao cadastrar: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
