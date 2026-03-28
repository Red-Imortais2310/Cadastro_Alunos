<?php
header('Content-Type: application/json; charset=utf-8');

try {
    // Conexão com banco
    $conn = new mysqli('localhost', 'root', '', 'escola');
    $conn->set_charset('utf8mb4');

    if ($conn->connect_error) {
        throw new Exception('Erro na conexão: ' . $conn->connect_error);
    }

    // Recebe dados
    $nome = $_POST['nome'] ?? '';
    $data_nascimento = $_POST['data_nascimento'] ?? '';
    $email = $_POST['email'] ?? '';
    $curso = $_POST['curso'] ?? '';
    $endereco = $_POST['endereco'] ?? '';

    // Validação
    if (empty($nome) || empty($data_nascimento) || empty($email) || empty($curso) || empty($endereco)) {
        throw new Exception('Todos os campos são obrigatórios');
    }

    // Upload da foto
    if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Erro no upload da foto');
    }

    $foto = $_FILES['foto'];
    $extensao = strtolower(pathinfo($foto['name'], PATHINFO_EXTENSION));
    $extensoes_permitidas = ['jpg', 'jpeg', 'png', 'gif'];

    if (!in_array($extensao, $extensoes_permitidas)) {
        throw new Exception('Formato de imagem inválido');
    }

    if ($foto['size'] > 4 * 1024 * 1024) {
        throw new Exception('Imagem muito grande. Máximo 4MB');
    }

    // Salvar foto
    $nome_foto = uniqid() . '.' . $extensao;
    $caminho_foto = '../uploads/' . $nome_foto;

    if (!is_dir('../uploads')) {
        mkdir('../uploads', 0777, true);
    }

    if (!move_uploaded_file($foto['tmp_name'], $caminho_foto)) {
        throw new Exception('Erro ao salvar foto');
    }

    // Inserir no banco
    $stmt = $conn->prepare("INSERT INTO alunos (nome, data_nascimento, email, curso, endereco, foto) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $nome, $data_nascimento, $email, $curso, $endereco, $nome_foto);

    if (!$stmt->execute()) {
        throw new Exception('Erro ao cadastrar: ' . $stmt->error);
    }

    echo json_encode(['success' => true, 'message' => 'Aluno cadastrado com sucesso']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>


