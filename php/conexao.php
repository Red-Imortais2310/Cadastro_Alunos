<?php
header('Content-Type: application/json; charset=utf-8');

// Configurações do banco de dados
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'cadastroAlunos');

// Criar conexão
function getConexao() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Verificar conexão
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Erro de conexão: ' . $conn->connect_error
        ]);
        exit();
    }
    
    // Definir charset
    $conn->set_charset('utf8mb4');
    
    return $conn;
}
?>
