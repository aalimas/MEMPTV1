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
  const cursorElement = document.getElementById("customCursor");
  if (!cursorElement) {
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
  }

  const customCursor = document.getElementById("customCursor");
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

  window.addEventListener('visibilitychange', () => {
    if (wakeLock && document.visibilityState === 'hidden') {
      wakeLock.release().then(() => {
        wakeLock = null;
        console.log('Wake Lock liberado.');
      });
    }
  });
}

function preventStandby() {
  const videoElement = document.createElement("video");
  Object.assign(videoElement, {
    src: "Imagens/VideoTeste1.mp4",
    loop: true,
    muted: true,
    playsInline: true,
    autoplay: true,
  });

  // Modificação: tornando o vídeo visivelmente leve
  Object.assign(videoElement.style, {
    position: "absolute",
    width: "10px",
    height: "10px",
    opacity: "0.1", // Torna o vídeo levemente visível
    zIndex: "9999", // Traz o vídeo para o primeiro plano
  });

  document.body.appendChild(videoElement);

  videoElement.play()
    .then(() => console.log("Vídeo de prevenção de standby reproduzido."))
    .catch(err => console.error("Erro ao reproduzir vídeo:", err.message));

  // Garantir que o vídeo não seja pausado automaticamente
  videoElement.addEventListener('pause', () => {
    videoElement.play();
    console.log("Vídeo reiniciado após pausa.");
  });
}

function simulateActivity() {
  moveCursorToBottomRight();
  simulateMouseClick();
}

// Função para enviar requisição HTTP de "keep-alive"
function sendKeepAliveRequest() {
  // Modificar a URL para um endpoint válido ou de teste na sua rede
  fetch('/keep-alive') 
    .then(response => {
      if (response.ok) {
        console.log("Requisição keep-alive enviada com sucesso.");
      } else {
        console.log("Erro ao enviar requisição keep-alive.");
      }
    })
    .catch(err => console.error("Erro ao enviar requisição keep-alive:", err));
}

// Modificação para simular atividade a cada 2 segundos
setInterval(simulateActivity, 2000);

// Enviar requisição keep-alive a cada 30 segundos
setInterval(sendKeepAliveRequest, 30000);  // 30 segundos

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
  simulateActivity();
  setInterval(simulateActivity, 2000);
  document.addEventListener('keydown', handleKeyPress);
};

