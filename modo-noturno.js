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
    objetivoSection.classList.toggle('bg-dark', nightModeToggle.checked);
    objetivoSection.classList.toggle('text-white', nightModeToggle.checked);
    instructionsSection.classList.toggle('bg-dark', nightModeToggle.checked);
    instructionsSection.classList.toggle('text-white', nightModeToggle.checked);
    h1.classList.toggle('text-white', nightModeToggle.checked);
    modoNoturnoText.classList.toggle('text-white', nightModeToggle.checked);
    exampleTable.classList.toggle('table-dark', nightModeToggle.checked);
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
