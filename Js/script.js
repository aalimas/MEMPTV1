let currentSlide = 0; // Índice do slide atual
const slides = document.querySelectorAll('.slides'); // Seleciona todos os slides
const indicators = document.querySelectorAll('.indicator'); // Seleciona todos os indicadores
const intervalTime = 10000; // Intervalo de tempo para alternar os slides (10 segundos)
let wakeLock = null; // Referência ao Wake Lock

// Inicializa o relógio e slideshow
initialize();

// Função principal de inicialização
function initialize() {
  setupSlideTransitions();
  updateClock();
  setInterval(updateClock, 1000); // Atualiza o relógio a cada segundo
  setInterval(nextSlide, intervalTime); // Alterna slides
  requestWakeLock(); // Ativa Wake Lock
  preventStandby(); // Previne standby com vídeo invisível
  simulateActivity(); // Simula atividade ao carregar
  setInterval(simulateActivity, 5000); // Simula atividade periodicamente
}

// Configura as transições dos slides
function setupSlideTransitions() {
  slides.forEach(slide => {
    slide.style.transition = 'opacity 0.5s ease-in-out'; // Define transição suave
  });
}

// Exibe o slide atual com transição suave
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index); // Atualiza classe 'active'
    indicators[i]?.classList.toggle('active', i === index); // Atualiza indicador
  });
  currentSlide = index; // Atualiza índice do slide atual
}

// Avança para o próximo slide
function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  showSlide(next);

  // Se for o próximo slide após o último (voltando ao primeiro), recarregue a página
  if (next === 0) {
    setTimeout(() => {
      simulateMouseMove(); // Garante movimento do mouse no canto antes da recarga
      window.location.reload();
    }, 100);
  }

  // Garante que o movimento do mouse aconteça a cada troca de slide
  simulateMouseMove();

  // Quando o segundo slide for exibido, simula um clique
  if (next === 1) {
    simulateMouseClick();
  }
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

// Simula o movimento do mouse sempre no canto inferior direito
function simulateMouseMove() {
  const clientX = window.innerWidth - 10; // Coordenada X: Canto inferior direito
  const clientY = window.innerHeight - 10; // Coordenada Y: Canto inferior direito
  const event = new MouseEvent("mousemove", {
    bubbles: true,
    cancelable: true,
    clientX: clientX,
    clientY: clientY,
  });
  document.dispatchEvent(event);

  // Move o cursor para o canto inferior direito
  if ('pointerLockElement' in document || 'mozPointerLockElement' in document) {
    document.body.style.cursor = "none"; // Oculta o cursor
  }
  console.log("Movimento do mouse simulado no canto inferior direito.");
}

// Ajusta o clique do mouse sempre no canto inferior direito
function simulateMouseClick() {
  const clientX = window.innerWidth - 10; // Coordenada X: Canto inferior direito
  const clientY = window.innerHeight - 10; // Coordenada Y: Canto inferior direito
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    clientX: clientX,
    clientY: clientY,
  });
  document.body.dispatchEvent(event);

  console.log("Clique do mouse simulado no canto inferior direito.");
}

// Solicita o Wake Lock
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

// Previne o modo de espera da TV com vídeo invisível
function preventStandby() {
  const videoElement = document.createElement("video");
  Object.assign(videoElement, {
    src: "Imagens/VideoTeste1.mp4",
    loop: true,
    muted: true,
    playsInline: true,
    autoplay: true,
  });

  Object.assign(videoElement.style, {
    position: "absolute",
    width: "1px",
    height: "1px",
    opacity: "0",
    zIndex: "-1",
  });

  document.body.appendChild(videoElement);

  videoElement.play()
    .then(() => console.log("Vídeo de prevenção de standby reproduzido."))
    .catch(err => console.error("Erro ao reproduzir vídeo:", err.message));
}

// Simula atividade de usuário
function simulateActivity() {
  simulateMouseMove();
  simulateMouseClick();
}
