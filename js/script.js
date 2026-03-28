// ============== CONFIGURAÇÃO INICIAL ==============
console.log('🚀 Sistema de Cadastro inicializado');

// ============== PREVIEW DA FOTO ==============
const fotoInput = document.getElementById('foto');
const fotoPreview = document.getElementById('fotoPreview');
const imagemPreview = document.getElementById('imagemPreview');
const fileInfo = document.getElementById('fileInfo');

if (fotoInput && fotoPreview && imagemPreview && fileInfo) {
    
    fotoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Verifica tamanho (máx 4MB)
            if (file.size > 4 * 1024 * 1024) {
                alert('❌ Arquivo muito grande! Máximo 4MB.');
                fotoInput.value = '';
                return;
            }

            // Verifica tipo
            const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!tiposPermitidos.includes(file.type)) {
                alert('❌ Formato inválido! Use JPG, PNG ou GIF.');
                fotoInput.value = '';
                return;
            }

            // Preview da imagem
            const reader = new FileReader();
            reader.onload = function(event) {
                imagemPreview.src = event.target.result;
                imagemPreview.style.display = 'block';
                const placeholder = fotoPreview.querySelector('.foto-placeholder');
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);

            // Info do arquivo
            const tamanhoKB = (file.size / 1024).toFixed(2);
            fileInfo.textContent = `📁 ${file.name} (${tamanhoKB} KB)`;
            fileInfo.style.color = '#3fb950';
        }
    });

    // Clique no preview para selecionar foto
    fotoPreview.addEventListener('click', function() {
        fotoInput.click();
    });
}

// ============== CADASTRO DE ALUNO ==============
const formAluno = document.getElementById('formAluno');

if (formAluno) {
    formAluno.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validação básica
        const nome = document.getElementById('nome')?.value.trim();
        const dataNasc = document.getElementById('dataNasc')?.value;
        const email = document.getElementById('email')?.value.trim();
        const curso = document.getElementById('curso')?.value;
        const endereco = document.getElementById('endereco')?.value.trim();
        const foto = document.getElementById('foto')?.files[0];

        // Verifica campos obrigatórios
        if (!nome || !dataNasc || !email || !curso || !endereco) {
            alert('⚠️ Preencha todos os campos obrigatórios!');
            return;
        }

        // Verifica foto
        if (!foto) {
            alert('⚠️ Selecione uma foto do aluno!');
            return;
        }

        // Validação de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('⚠️ E-mail inválido!');
            return;
        }

        // Preparar FormData
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('data_nascimento', dataNasc);
        formData.append('email', email);
        formData.append('curso', curso);
        formData.append('endereco', endereco);
        formData.append('foto', foto);

        // Desabilitar botão durante envio
        const btnSubmit = formAluno.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '⏳ Cadastrando...';

        try {
            const response = await fetch('php/cadastrar.php', {
                method: 'POST',
                body: formData
            });

            const text = await response.text();
            console.log('📥 Resposta do servidor:', text);

            // Tentar parsear como JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('❌ Erro ao parsear JSON:', text);
                throw new Error('Erro de comunicação com o servidor.');
            }

            if (data.success) {
                alert('✅ Aluno cadastrado com sucesso!');
                
                // Resetar formulário
                formAluno.reset();
                
                // Resetar preview da foto
                if (imagemPreview) imagemPreview.style.display = 'none';
                const placeholder = fotoPreview?.querySelector('.foto-placeholder');
                if (placeholder) placeholder.style.display = 'block';
                
                if (fileInfo) {
                    fileInfo.textContent = 'Nenhum arquivo selecionado';
                    fileInfo.style.color = '#8b949e';
                }
            } else {
                alert('❌ Erro: ' + (data.message || 'Erro desconhecido'));
            }

        } catch (error) {
            console.error('❌ Erro:', error);
            alert('❌ Erro ao cadastrar aluno: ' + error.message);
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = textoOriginal;
        }
    });
}

// ============== OCULTAR SEÇÃO DE TABELA ==============
const tabelaSection = document.querySelector('.table-section');
if (tabelaSection) {
    tabelaSection.remove(); // Remove completamente do DOM
}

console.log('✅ Sistema pronto para uso!');
