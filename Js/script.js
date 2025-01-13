let currentSlide = 0; // Índice do slide atual
const slides = document.querySelectorAll('.slides'); // Seleciona todos os slides
const indicators = document.querySelectorAll('.indicator'); // Seleciona todos os indicadores
const intervalTime = 10000; // Intervalo de tempo para alternar os slides (10 segundos)

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index); // Adiciona a classe 'active' ao slide correto
    indicators[i].classList.toggle('active', i === index); // Adiciona a classe 'active' ao indicador correspondente
  });
  currentSlide = index; // Atualiza o índice do slide atual
}

function nextSlide() {
  const next = (currentSlide + 1) % slides.length; // Calcula o próximo slide
  if (next === 0) {
    // Se o próximo slide for o primeiro (índice 0), recarrega a página
    window.location.reload();
  } else {
    // Caso contrário, exibe o próximo slide
    showSlide(next);
  }
}

// Adiciona evento de clique nos indicadores
indicators.forEach(indicator => {
  indicator.addEventListener('click', (event) => {
    event.preventDefault(); // Impede comportamento padrão
    const index = parseInt(indicator.getAttribute('data-index')); // Obtém o índice do indicador
    showSlide(index); // Exibe o slide correspondente ao índice
  });
});

// Inicia o slideshow com um intervalo de tempo
setInterval(nextSlide, intervalTime);


// Função para atualizar o relógio digital
function updateClock() {
  const clockElement = document.getElementById('digitalClock'); // Seleciona o elemento do relógio
  const now = new Date(); // Obtém a data e hora atuais
  const hours = String(now.getHours()).padStart(2, '0'); // Formata a hora com 2 dígitos
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Formata os minutos com 2 dígitos
  const seconds = String(now.getSeconds()).padStart(2, '0'); // Formata os segundos com 2 dígitos
  clockElement.textContent = `${hours}:${minutes}:${seconds}`; // Atualiza o texto do relógio
}

// Atualiza o relógio a cada segundo
setInterval(updateClock, 1000);

// Define o valor inicial do relógio
updateClock();
