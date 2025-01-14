let currentSlide = 0; // Índice do slide atual
const slides = document.querySelectorAll('.slides'); // Seleciona todos os slides
const indicators = document.querySelectorAll('.indicator'); // Seleciona todos os indicadores
const intervalTime = 10000; // Intervalo de tempo para alternar os slides (10 segundos)

// Função para exibir o slide atual com transição suave
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index); // Adiciona a classe 'active' ao slide correto
    indicators[i].classList.toggle('active', i === index); // Adiciona a classe 'active' ao indicador correspondente
  });
  currentSlide = index; // Atualiza o índice do slide atual
}

// Função para avançar para o próximo slide e recarregar a página no início
function nextSlide() {
  const next = (currentSlide + 1) % slides.length; // Calcula o próximo slide
  if (next === 0) {
    // Recarrega a página se o próximo slide for o primeiro
    window.location.reload();
  } else {
    // Caso contrário, exibe o próximo slide
    showSlide(next);
  }
}

// Inicia o slideshow com um intervalo de tempo
setInterval(nextSlide, intervalTime);

// Função para atualizar o relógio digital
function updateClock() {
  const clockElement = document.getElementById('digitalClock'); // Seleciona o elemento do relógio
  if (clockElement) { // Verifica se o elemento existe
    const now = new Date(); // Obtém a data e hora atuais
    const hours = String(now.getHours()).padStart(2, '0'); // Formata a hora com 2 dígitos
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Formata os minutos com 2 dígitos
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Formata os segundos com 2 dígitos
    clockElement.textContent = `${hours}:${minutes}:${seconds}`; // Atualiza o texto do relógio
  }
}

// Atualiza o relógio a cada segundo
setInterval(updateClock, 1000);

// Define o valor inicial do relógio
updateClock();

// Wake Lock API para evitar que a tela entre em modo de espera
let wakeLock = null;

// Função para solicitar o Wake Lock
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen'); // Ativa o Wake Lock
      console.log('Wake Lock ativado.');
    } else {
      console.warn('API Wake Lock não é suportada neste navegador.');
    }
  } catch (err) {
    console.error(`Falha ao ativar o Wake Lock: ${err.name}, ${err.message}`);
  }
}

// Libera o Wake Lock ao sair da aba ou fechar a página
window.addEventListener('visibilitychange', () => {
  if (wakeLock !== null && document.visibilityState === 'hidden') {
    wakeLock.release().then(() => {
      wakeLock = null;
      console.log('Wake Lock liberado.');
    });
  }
});

// Solicita o Wake Lock ao carregar a página
requestWakeLock();

// Função para prevenir o modo de espera da TV
function preventStandby() {
  const videoElement = document.createElement("video");
  videoElement.src = "Imagens/VideoTeste1.mp4"; // Caminho para o arquivo de vídeo
  videoElement.loop = true;
  videoElement.muted = true;

  videoElement.play().catch(err => {
    console.warn("Falha ao reproduzir o vídeo:", err.message);
  });

  videoElement.style.position = "absolute";
  videoElement.style.width = "1px";
  videoElement.style.height = "1px";
  videoElement.style.opacity = "0";

  document.body.appendChild(videoElement);
}

// Função para simular movimento do mouse
function simulateMouseMove() {
  const event = new MouseEvent('mousemove', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(event);
}

// Simula o movimento do mouse a cada 5 minutos
setInterval(simulateMouseMove, 5 * 60 * 1000);

// Chamar a função para prevenir o standby
preventStandby();

// Transição suave entre slides
slides.forEach(slide => {
  slide.style.transition = 'opacity 0.5s ease-in-out'; // Define a transição
});
