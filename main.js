function processFile() {
  const fileInput = document.getElementById('fileInput');

  if (fileInput.files.length === 0) {
    alert('Por favor, selecione um arquivo CSV.');
    return;
  }

  const file = fileInput.files[0];

  const reader = new FileReader();
  reader.onload = function (event) {
    const contents = event.target.result;

    console.log('Conteúdo do arquivo CSV:', contents); // Adicione esta linha

    Papa.parse(contents, {
      header: true, // Indica que a primeira linha contém títulos das colunas
      complete: function (results) {
        const data = results.data;

        if (data.length <= 0) {
          alert('A tabela não contém dados.');
          return;
        }

        const renamedImages = [];
        const numeroDeImagens = data.length;

        console.log('Número de imagens a processar:', numeroDeImagens); // Adicione esta linha

        data.forEach((row) => {
          const nome = row.NOME;
          const url = row.IMAGEM;
          renamedImages.push({ nome, url });
        });

        console.log('Dados das imagens renomeadas:', renamedImages); // Adicione esta linha

        const zip = new JSZip();
        const imagePromises = []; // Declare a variável imagePromises

        renamedImages.forEach((image) => {
          const imagePromise = fetch(image.url)
            .then((response) => response.blob())
            .then((blob) => {
              zip.file(`${image.nome}.jpg`, blob);
            });

          imagePromises.push(imagePromise);
        });

        // Aguarda o download de todas as imagens
        Promise.all(imagePromises).then(() => {
          console.log('Todas as imagens foram baixadas com sucesso.'); // Adicione esta linha

          // Gera o arquivo ZIP e cria o link de download
          zip.generateAsync({ type: 'blob' }).then((content) => {
            const url = URL.createObjectURL(content);
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = url;
            downloadLink.download = 'imagens_renomeadas.zip';
            downloadLink.textContent = `Clique aqui para baixar as ${numeroDeImagens} imagens renomeadas`;
            downloadLink.style.display = 'block';
          });
        });
      },
    });
  };

  reader.readAsText(file);
}
