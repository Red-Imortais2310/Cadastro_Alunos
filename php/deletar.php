<?php
require_once 'conexao.php';

// Receber dados JSON
$dados = json_decode(file_get_contents('php://input'), true);

// Validar dados
if (!$dados || !isset($dados['id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'ID não informado!'
    ]);
    exit();
}

$conn = getConexao();

// Preparar SQL
$sql = "DELETE FROM alunos WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $dados['id']);

// Executar
if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Aluno excluído com sucesso!'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao excluir: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
