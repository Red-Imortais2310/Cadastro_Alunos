<?php
require_once 'conexao.php';

$conn = getConexao();

// Verificar se é busca por ID
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $sql = "SELECT * FROM alunos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows > 0) {
        echo json_encode($resultado->fetch_assoc());
    } else {
        echo json_encode(null);
    }
} else {
    // Listar todos
    $sql = "SELECT * FROM alunos ORDER BY id DESC";
    $resultado = $conn->query($sql);
    
    $alunos = [];
    while ($row = $resultado->fetch_assoc()) {
        $alunos[] = $row;
    }
    
    echo json_encode($alunos);
}

$conn->close();
?>
