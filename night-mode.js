document.addEventListener('DOMContentLoaded', function () {
  const nightModeToggle = document.getElementById('nightModeToggle');
  
  // Criar o container flutuante para o toggle se ainda não existir
  if (!document.querySelector('.night-mode-float')) {
    const toggleContainer = document.querySelector('.position-fixed');
    if (toggleContainer) {
      toggleContainer.classList.add('night-mode-float', 'bg-primary', 'rounded-pill', 'shadow');
    }
  }
  
  // Carregar preferência salva no localStorage (se existir)
  const savedNightMode = localStorage.getItem('nightMode');
  if (savedNightMode !== null) {
    nightModeToggle.checked = savedNightMode === 'true';
  } else {
    // Verificar preferência do sistema se não houver configuração salva
    const prefersNightMode = window.matchMedia('(prefers-color-scheme: dark)');
    nightModeToggle.checked = prefersNightMode.matches;
  }
  
  // Aplicar modo noturno baseado no estado do toggle
  applyNightMode(nightModeToggle.checked);
  
  // Função para aplicar o modo noturno
  function applyNightMode(isNightMode) {
    const body = document.body;
    const fileInput = document.getElementById('fileInput');
    const cards = document.querySelectorAll('.card');
    const obSection = document.getElementById('objetivo');
    const instructSection = document.querySelector('.instructions');
    const footer = document.querySelector('footer');
    const listItems = document.querySelectorAll('.list-group-item');
    const allTables = document.querySelectorAll('table');
    const tableHeads = document.querySelectorAll('thead');
    
    // Aplicar classes ao body
    body.classList.toggle('bg-dark', isNightMode);
    body.classList.toggle('text-white', isNightMode);
    
    // Estilizar input de arquivo
    if (fileInput) {
      fileInput.classList.toggle('bg-dark', isNightMode);
      fileInput.classList.toggle('text-white', isNightMode);
    }
    
    // Estilizar seções
    if (obSection) {
      obSection.classList.toggle('bg-dark', isNightMode);
      obSection.classList.toggle('text-white', isNightMode);
      obSection.classList.toggle('bg-light', !isNightMode);
    }
    
    if (instructSection) {
      instructSection.classList.toggle('bg-dark', isNightMode);
      instructSection.classList.toggle('text-white', isNightMode);
      instructSection.classList.toggle('bg-light', !isNightMode);
    }
    
    // Estilizar cards
    cards.forEach(card => {
      card.classList.toggle('bg-dark', isNightMode);
      card.classList.toggle('text-white', isNightMode);
    });
    
    // Estilizar o footer corretamente no modo diurno
    if (footer) {
      if (!isNightMode) {
        // No modo diurno, o footer precisa ser visível
        footer.classList.remove('bg-dark');
        footer.classList.add('bg-primary');
      } else {
        // No modo noturno, mantemos o bg-dark
        footer.classList.remove('bg-primary');
        footer.classList.add('bg-dark');
      }
    }
    
    // Estilizar todas as tabelas corretamente
    allTables.forEach(table => {
      if (isNightMode) {
        table.classList.add('table-dark');
        table.classList.remove('table-light', 'bg-white');
      } else {
        table.classList.remove('table-dark');
        table.classList.add('table-light', 'bg-white');
      }
    });
    
    // Corrigir o thead das tabelas
    tableHeads.forEach(thead => {
      if (isNightMode) {
        thead.classList.add('table-dark');
      } else {
        // No modo diurno, permite que o thead tenha classe table-dark apenas
        // se for explicitamente definido no html original
          thead.classList.remove('table-dark');
          thead.classList.add('table-light');
      }
    });
    
    // Estilizar itens da lista de instruções
    listItems.forEach(item => {
      item.classList.toggle('bg-dark', isNightMode);
      item.classList.toggle('text-white', isNightMode);
      item.classList.toggle('border-secondary', isNightMode);
    });
    
    // Salvar preferência no localStorage
    localStorage.setItem('nightMode', isNightMode);
  }
  
  // Evento para alternar o modo noturno quando o botão deslizante é alterado
  nightModeToggle.addEventListener('change', function() {
    applyNightMode(this.checked);
  });
  
  // Também responder a mudanças na preferência do sistema
  const prefersNightMode = window.matchMedia('(prefers-color-scheme: dark)');
  prefersNightMode.addEventListener('change', (e) => {
    // Apenas atualizar se o usuário não tiver definido uma preferência
    if (localStorage.getItem('nightMode') === null) {
      nightModeToggle.checked = e.matches;
      applyNightMode(e.matches);
    }
  });
});