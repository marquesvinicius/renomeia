document.addEventListener('DOMContentLoaded', function () {
  const nightModeToggle = document.getElementById('nightModeToggle');

  // Função para alternar o modo noturno
  function toggleNightMode() {
    const body = document.body;
    const fileInput = document.getElementById('fileInput');
    const objetivoSection = document.getElementById('objetivo');
    const instructionsSection = document.querySelector('.instructions');
    const h1 = document.querySelector('h1');
    const modoNoturnoText = document.getElementById('modo-noturno-text');
    const exampleTable = document.querySelector('.example-table');
  
    body.classList.toggle('bg-dark', nightModeToggle.checked);
    fileInput.classList.toggle('bg-dark', nightModeToggle.checked);
    fileInput.classList.toggle('text-white', nightModeToggle.checked);
    h1.classList.toggle('text-white', nightModeToggle.checked);
    modoNoturnoText.classList.toggle('text-white', nightModeToggle.checked);
    exampleTable.classList.toggle('table-dark', nightModeToggle.checked);
  
    // Verifique se o modo noturno está ativado
    if (nightModeToggle.checked) {
      objetivoSection.classList.remove('bg-light');
      objetivoSection.classList.add('bg-secondary');
      objetivoSection.classList.add('text-white');
  
      instructionsSection.classList.remove('bg-light');
      instructionsSection.classList.add('bg-secondary');
      instructionsSection.classList.add('text-white');

    } else {
      // Caso contrário, restaure o estilo do modo diurno
      objetivoSection.classList.remove('bg-secondary');
      objetivoSection.classList.add('bg-light');
      objetivoSection.classList.add('text-dark');
  
      instructionsSection.classList.remove('bg-secondary');
      instructionsSection.classList.add('bg-light');
      instructionsSection.classList.add('text-dark');
    }
  }

  // Evento para alternar o modo noturno quando o botão deslizante é alterado
  nightModeToggle.addEventListener('change', toggleNightMode);

  // Verifique o estado do botão deslizante com base nas preferências do usuário (se disponível)
  const prefersNightMode = window.matchMedia('(prefers-color-scheme: dark)');
  nightModeToggle.checked = prefersNightMode.matches;

  // Ative o modo noturno inicialmente, se a preferência do usuário for modo noturno
  if (prefersNightMode.matches) {
    toggleNightMode();
  }
});
