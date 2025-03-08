function processFile() {
  const fileInput = document.getElementById('fileInput');
  const statusElement = document.getElementById('status');
  
  // Resetar status
  statusElement.innerHTML = '';
  statusElement.classList.remove('text-danger', 'text-success');
  document.getElementById('downloadLink').style.display = 'none';

  if (fileInput.files.length === 0) {
    showError('Por favor, selecione um arquivo CSV.');
    return;
  }

  const file = fileInput.files[0];
  
  showStatus('Processando arquivo CSV...');

  const reader = new FileReader();
  reader.onload = function (event) {
    const contents = event.target.result;

    console.log('Conteúdo do arquivo CSV:', contents);

    Papa.parse(contents, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const data = results.data;

        if (data.length <= 0 || !data[0].NOME || !data[0].IMAGEM) {
          showError('A tabela não contém dados válidos. Certifique-se de que a tabela tenha as colunas "NOME" e "IMAGEM".');
          return;
        }

        const renamedImages = [];
        const numeroDeImagens = data.length;

        console.log('Número de imagens a processar:', numeroDeImagens);

        // Filtrar linhas vazias e inválidas
        data.forEach((row) => {
          if (row.NOME && row.IMAGEM) {
            const nome = row.NOME.trim();
            const url = row.IMAGEM.trim();
            
            if (nome && url) {
              renamedImages.push({ nome, url });
            }
          }
        });

        if (renamedImages.length === 0) {
          showError('Nenhum dado válido foi encontrado na tabela.');
          return;
        }

        console.log('Dados das imagens renomeadas:', renamedImages);
        
        showStatus(`Processando ${renamedImages.length} imagens...`);

        const zip = new JSZip();
        const imagePromises = [];
        const errors = [];

        renamedImages.forEach((image, index) => {
          const imagePromise = fetchWithCORS(image.url)
            .then((blob) => {
              if (!blob) {
                throw new Error(`Não foi possível baixar a imagem: ${image.url}`);
              }
              
              // Obter a extensão correta do arquivo
              const extension = getExtensionFromUrl(image.url) || 'jpg';
              zip.file(`${image.nome}.${extension}`, blob);
              updateProgress(index + 1, renamedImages.length);
            })
            .catch((error) => {
              console.error(`Erro ao processar imagem ${image.nome}:`, error);
              errors.push({ nome: image.nome, url: image.url, erro: error.message });
            });

          imagePromises.push(imagePromise);
        });

        // Aguarda o download de todas as imagens
        Promise.allSettled(imagePromises).then((results) => {
          const successCount = results.filter(r => r.status === 'fulfilled').length;
          
          if (errors.length > 0) {
            // Adicionar arquivo de log com erros
            const errorLog = errors.map(e => `Imagem: ${e.nome} (${e.url}) - Erro: ${e.erro}`).join('\n');
            zip.file('erros.txt', errorLog);
            
            showStatus(`Processamento concluído com ${errors.length} erros de ${renamedImages.length} imagens.`, 'warning');
          } else {
            showStatus(`Todas as ${renamedImages.length} imagens foram processadas com sucesso!`, 'success');
          }

          // Gera o arquivo ZIP e cria o link de download
          zip.generateAsync({ type: 'blob' }).then((content) => {
            const url = URL.createObjectURL(content);
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = url;
            downloadLink.download = 'imagens_renomeadas.zip';
            downloadLink.textContent = `Baixar ${successCount} imagens renomeadas`;
            downloadLink.style.display = 'block';
            downloadLink.className = 'btn btn-success mt-3';
          });
        });
      },
      error: function(error) {
        showError('Erro ao processar o arquivo CSV: ' + error.message);
      }
    });
  };

  reader.onerror = function() {
    showError('Erro ao ler o arquivo.');
  };

  reader.readAsText(file);
}

// Função para contornar problemas de CORS usando um proxy
function fetchWithCORS(url) {
  // Lista de serviços proxy CORS que podem ser usados
  const corsProxies = [
    'https://api.allorigins.win/raw?url=',
    'https://cors-anywhere.herokuapp.com/',
    'https://crossorigin.me/'
  ];
  
  // Escolher um proxy (o primeiro da lista)
  const proxyUrl = corsProxies[0] + encodeURIComponent(url);
  
  // Tentar fazer a requisição usando o proxy
  return fetch(proxyUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro de rede: ${response.status} ${response.statusText}`);
      }
      return response.blob();
    })
    .catch(error => {
      console.error('Erro no fetch com proxy:', error);
      
      // Se falhar com o proxy, tentar diretamente (pode funcionar para algumas imagens)
      console.log('Tentando sem proxy:', url);
      return fetch(url, { mode: 'no-cors' })
        .then(response => {
          // Devido à política no-cors, não podemos verificar se a resposta está ok
          return response.blob();
        })
        .catch(directError => {
          console.error('Erro no fetch direto:', directError);
          return null;
        });
    });
}

// Função para obter a extensão correta do arquivo a partir da URL
function getExtensionFromUrl(url) {
  try {
    // Remover parâmetros da URL
    const cleanUrl = url.split('?')[0].split('#')[0];
    // Obter a extensão da URL
    const extension = cleanUrl.split('.').pop().toLowerCase();
    
    // Verificar se é uma extensão de imagem válida
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return extension === 'jpeg' ? 'jpg' : extension;
    }
    
    // Se não conseguirmos determinar a extensão da URL, tentamos pelo tipo MIME
    return null;
  } catch (error) {
    console.error('Erro ao obter extensão:', error);
    return null;
  }
}

// Função para mostrar mensagem de erro
function showError(message) {
  const statusElement = document.getElementById('status');
  statusElement.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> ${message}`;
  statusElement.className = 'alert alert-danger mt-3';
}

// Função para mostrar status
function showStatus(message, type = 'info') {
  const statusElement = document.getElementById('status');
  statusElement.innerHTML = message;
  statusElement.className = `alert alert-${type} mt-3`;
}

// Função para atualizar a barra de progresso
function updateProgress(current, total) {
  const percent = Math.round((current / total) * 100);
  const statusElement = document.getElementById('status');
  statusElement.innerHTML = `
    <div>Processando imagens: ${current}/${total}</div>
    <div class="progress mt-2">
      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" 
           style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
        ${percent}%
      </div>
    </div>
  `;
  statusElement.className = 'alert alert-info mt-3';
}