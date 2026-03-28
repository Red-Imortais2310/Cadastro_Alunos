<?php
require_once 'conexao.php';

// Receber dados JSON
$dados = json_decode(file_get_contents('php://input'), true);

// Validar dados
if (!$dados || !isset($dados['id']) || !isset($dados['nome'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Dados incompletos!'
    ]);
    exit();
}

$conn = getConexao();

// Preparar SQL
$sql = "UPDATE alunos SET nome = ?, dataNasc = ?, email = ?, endereco = ?, curso = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sssssi', 
    $dados['nome'], 
    $dados['dataNasc'], 
    $dados['email'], 
    $dados['endereco'], 
    $dados['curso'],
    $dados['id']
);

// Executar
if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Aluno atualizado com sucesso!'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao atualizar: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
