let currentSlide = 0; // Índice do slide atual
const slides = document.querySelectorAll('.slides'); // Seleciona todos os slides
const indicators = document.querySelectorAll('.indicator'); // Seleciona todos os indicadores
const intervalTime = 10000; // Intervalo de tempo padrão para alternar os slides (10 segundos)
let slideTimer; // Referência ao timer
let wakeLock = null; // Referência ao Wake Lock

// Função para entrar no modo de tela cheia
function enterFullScreen() {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  }
  console.log("Modo de tela cheia ativado.");
}

// Monitorar saída do modo de tela cheia
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    console.log("Tela cheia desativada. Reativando...");
    enterFullScreen();
  }
});

// Configura as transições dos slides
function setupSlideTransitions() {
  slides.forEach(slide => {
    slide.style.transition = 'opacity 0.5s ease-in-out';
  });
}

// Exibe o slide atual com transição suave
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    indicators[i]?.classList.toggle('active', i === index);
  });
  currentSlide = index;
}

// Avança para o próximo slide
function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  showSlide(next);

  if (next === 0) {
    setTimeout(() => {
      moveCursorToBottomRight();
      window.location.reload();
    }, 100);
  }

  moveCursorToBottomRight();

  if (next === 1) {
    simulateMouseClick();
  }
}

// Reinicia a contagem de slides com um novo tempo
function resetSlideTimer(delay = 60000) {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, delay);
}

// Atualiza o relógio digital
function updateClock() {
  const clockElement = document.getElementById('digitalClock');
  if (clockElement) {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    clockElement.textContent = formattedTime;
  }
}

// Simula o clique do mouse sempre no canto inferior direito
function simulateMouseClick() {
  const clientX = window.innerWidth - 10;
  const clientY = window.innerHeight - 10;
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    clientX: clientX,
    clientY: clientY,
  });
  document.body.dispatchEvent(event);
  console.log("Clique do mouse simulado no canto inferior direito.");
}

function moveCursorToBottomRight() {
  const customCursor = document.createElement("div");
  customCursor.id = "customCursor";
  Object.assign(customCursor.style, {
    position: "fixed",
    width: "10px",
    height: "10px",
    backgroundColor: "transparent",
    borderRadius: "50%",
    zIndex: "9999",
    pointerEvents: "none",
  });

  document.body.appendChild(customCursor);
  customCursor.style.left = `${window.innerWidth - 15}px`;
  customCursor.style.top = `${window.innerHeight - 15}px`;
  console.log("Cursor movido visualmente para o canto inferior direito.");
}

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock ativado.');
    } else {
      console.warn('API Wake Lock não suportada.');
    }
  } catch (err) {
    console.error(`Erro ao ativar o Wake Lock: ${err.name}, ${err.message}`);
  }
}

function preventStandby() {
  simulateActivity();

  // Movimentação leve do cursor continuamente para garantir atividade
  setInterval(() => {
    moveCursorRandomly();
    simulateKeyPress(); // Simula pressionamento de tecla invisível
  }, 1000);
}

function moveCursorRandomly() {
  const event = new MouseEvent("mousemove", {
    clientX: Math.random() * window.innerWidth,
    clientY: Math.random() * window.innerHeight,
    bubbles: true,
    cancelable: true,
  });
  document.body.dispatchEvent(event);
  console.log("Movimento aleatório do cursor simulado.");
}

function simulateKeyPress() {
  const event = new KeyboardEvent('keydown', { key: 'Shift', bubbles: true });
  document.body.dispatchEvent(event);
  console.log("Simulação de pressionamento de tecla.");
}

function simulateActivity() {
  moveCursorToBottomRight();
  simulateMouseClick();
}

// Alternância de slides usando o teclado numérico
function handleKeyPress(event) {
  const key = event.key;
  const slideIndex = parseInt(key, 10) - 1;

  if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < slides.length) {
    showSlide(slideIndex); // Mostra o slide correspondente
    console.log(`Slide ${key} exibido. Reiniciando temporizador.`);
    resetSlideTimer(); // Espera 1 minuto antes de continuar automaticamente
  }
}

window.onload = () => {
  enterFullScreen();
  setupSlideTransitions();
  updateClock();
  setInterval(updateClock, 1000);
  resetSlideTimer(intervalTime);
  requestWakeLock();
  preventStandby();
  document.addEventListener('keydown', handleKeyPress);
};
