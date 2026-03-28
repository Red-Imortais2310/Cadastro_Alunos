// ===== CADASTRAR ALUNO =====
const API_URL = '/php';


async function cadastrar(event) {
    event.preventDefault();

    // Pegar valores do formulário
    const nome = document.getElementById('nome').value.trim();
    const dataNasc = document.getElementById('dataNasc').value;
    const email = document.getElementById('email').value.trim();
    const curso = document.getElementById('curso').value;
    const endereco = document.getElementById('endereco').value.trim();
    const fotoInput = document.getElementById('foto');

    // 🔍 DEBUG
    console.log('📋 Dados capturados:', {
        nome, dataNasc, email, curso, endereco,
        temFoto: fotoInput.files.length > 0
    });

    // Validação
    if (!nome || !dataNasc || !email || !curso || !endereco) {
        mostrarMensagem('Preencha todos os campos obrigatórios!', 'erro');
        return;
    }

    // Criar FormData
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('dataNasc', dataNasc);
    formData.append('email', email);
    formData.append('curso', curso);
    formData.append('endereco', endereco);

    if (fotoInput.files.length > 0) {
        formData.append('foto', fotoInput.files[0]);
    }

    // 🔍 DEBUG - Ver FormData
    console.log('📤 Enviando:');
    for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
    }

    try {
        const response = await fetch('/php/cadastrar.php', {
            method: 'POST',
            body: formData
        });

        const texto = await response.text();
        console.log('📥 Resposta bruta:', texto);

        const resultado = JSON.parse(texto);
        console.log('📥 Resposta JSON:', resultado);

        if (resultado.success) {
            mostrarMensagem(resultado.message, 'sucesso');
            document.getElementById('formAluno').reset();
            
            // Resetar preview da foto
            const imagemPreview = document.getElementById('imagemPreview');
            const placeholder = document.querySelector('.foto-placeholder');
            const fileInfo = document.getElementById('fileInfo');
            
            if (imagemPreview) imagemPreview.style.display = 'none';
            if (placeholder) placeholder.style.display = 'flex';
            if (fileInfo) fileInfo.textContent = 'Nenhum arquivo selecionado';
            
            carregarAlunos();
        } else {
            mostrarMensagem(resultado.message, 'erro');
        }

    } catch (erro) {
        console.error('❌ Erro:', erro);
        mostrarMensagem('Erro ao cadastrar aluno!', 'erro');
    }
}

// ===== CARREGAR ALUNOS =====
async function carregarAlunos() {
    try {
        const response = await fetch('/php/listar.php');

        const resultado = await response.json();
        const alunos = resultado.data || [];
        
        const tbody = document.getElementById('tabelaAlunos');
        tbody.innerHTML = '';
        
        alunos.forEach(aluno => {
            const tr = document.createElement('tr');
            
            // CORREÇÃO: Caminho correto da foto
            const fotoUrl = aluno.foto ? `/uploads/${aluno.foto}` : 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect fill=%22%23ddd%22 width=%2250%22 height=%2250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22%23999%22%3E?%3C/text%3E%3C/svg%3E';
            
            tr.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${formatarData(aluno.dataNasc)}</td>
                <td>${aluno.email}</td>
                <td>${aluno.curso}</td>
                <td>${aluno.endereco}</td>
                <td><img src="${fotoUrl}" alt="Foto" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"></td>
            `;
            
            tbody.appendChild(tr);
        });
        
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        alert('Erro ao carregar a lista de alunos');
    }
}

// ===== EDITAR ALUNO =====
async function editarAluno(id) {
    const novoNome = prompt('Digite o novo nome:');
    if (!novoNome) return;
    
    const novoEmail = prompt('Digite o novo email:');
    if (!novoEmail) return;
    
    const novoCurso = prompt('Digite o novo curso:');
    if (!novoCurso) return;
    
    const novoEndereco = prompt('Digite o novo endereço:');
    if (!novoEndereco) return;
    
    const novaDataNasc = prompt('Digite a nova data de nascimento (YYYY-MM-DD):');
    if (!novaDataNasc) return;
    
    try {
        const response = await fetch('/php/atualizar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                nome: novoNome,
                email: novoEmail,
                curso: novoCurso,
                endereco: novoEndereco,
                dataNasc: novaDataNasc
            })
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
            mostrarMensagem(resultado.message, 'sucesso');
            carregarAlunos();
        } else {
            mostrarMensagem(resultado.message, 'erro');
        }
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        mostrarMensagem('Erro ao atualizar aluno!', 'erro');
    }
}

// ===== EXCLUIR ALUNO =====
async function excluirAluno(id) {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) {
        return;
    }
    
    try {
        const response = await fetch('/php/deletar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });
        
        const resultado = await response.json();
        
        if (resultado.success) {
            mostrarMensagem(resultado.message, 'sucesso');
            carregarAlunos();
        } else {
            mostrarMensagem(resultado.message, 'erro');
        }
    } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        mostrarMensagem('Erro ao excluir aluno!', 'erro');
    }
}

// ===== FORMATAR DATA =====
function formatarData(data) {
    if (!data) return '-';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarDataHora(dataHora) {
    if (!dataHora) return '-';
    const data = new Date(dataHora);
    return data.toLocaleString('pt-BR');
}

// ===== MENSAGENS =====
function mostrarMensagem(texto, tipo) {
    // Remover mensagem anterior
    const msgAnterior = document.querySelector('.mensagem');
    if (msgAnterior) msgAnterior.remove();

    // Criar nova mensagem
    const mensagem = document.createElement('div');
    mensagem.className = `mensagem ${tipo}`;
    mensagem.textContent = texto;

    // Adicionar ao topo do formulário
    const formSection = document.querySelector('.form-section');
    formSection.insertBefore(mensagem, formSection.firstChild);

    // Remover após 5 segundos
    setTimeout(() => mensagem.remove(), 5000);
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Carregar alunos ao iniciar
    carregarAlunos();

    // Adicionar evento ao formulário
    const form = document.getElementById('formAluno');
    if (form) {
        form.addEventListener('submit', cadastrar);
    }

    // Preview da foto
    const fotoInput = document.getElementById('foto');
    if (fotoInput) {
        fotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const fileInfo = document.getElementById('fileInfo');
            const imagemPreview = document.getElementById('imagemPreview');
            const placeholder = document.querySelector('.foto-placeholder');

            if (file) {
                // Verificar tamanho (4MB)
                if (file.size > 4 * 1024 * 1024) {
                    alert('Arquivo muito grande! Máximo 4MB.');
                    fotoInput.value = '';
                    return;
                }

                // Mostrar info do arquivo
                fileInfo.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;

                // Mostrar preview
                const reader = new FileReader();
                reader.onload = function(event) {
                    imagemPreview.src = event.target.result;
                    imagemPreview.style.display = 'block';
                    if (placeholder) placeholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            } else {
                fileInfo.textContent = 'Nenhum arquivo selecionado';
                imagemPreview.style.display = 'none';
                if (placeholder) placeholder.style.display = 'flex';
            }
        });
    }

    // Busca na tabela
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const termo = e.target.value.toLowerCase();
            const linhas = document.querySelectorAll('#corpoTabela tr');

            linhas.forEach(linha => {
                const texto = linha.textContent.toLowerCase();
                linha.style.display = texto.includes(termo) ? '' : 'none';
            });
        });
    }
});

