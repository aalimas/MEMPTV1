let currentSlide = 0;
const slides = document.querySelectorAll('.slides');
const indicators = document.querySelectorAll('.indicator');
const intervalTime = 10000;
let slideTimer;
let wakeLock = null;

function enterFullScreen() {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  }
  console.log("Modo de tela cheia ativado.");
}

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    console.log("Tela cheia desativada. Reativando...");
    enterFullScreen();
  }
});

function setupSlideTransitions() {
  slides.forEach(slide => {
    slide.style.transition = 'opacity 0.5s ease-in-out';
  });
}

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    indicators[i]?.classList.toggle('active', i === index);
  });
  currentSlide = index;
}

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

function resetSlideTimer(delay = 60000) {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, delay);
}

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

function simulateMouseClick() {
  const clientX = Math.random() * window.innerWidth;
  const clientY = Math.random() * window.innerHeight;
  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    clientX: clientX,
    clientY: clientY,
  });
  document.body.dispatchEvent(event);
  console.log("Clique do mouse simulado em posição aleatória.");
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
  customCursor.style.left = `${Math.random() * (window.innerWidth - 15)}px`;
  customCursor.style.top = `${Math.random() * (window.innerHeight - 15)}px`;
  console.log("Cursor movido aleatoriamente.");
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
  simulateActivity();

  setInterval(() => {
    moveCursorRandomly();
    simulateKeyPress();
    simulateScroll();
  }, 2000);
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
  const keys = ['Shift', 'Alt', 'Control'];
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const event = new KeyboardEvent('keydown', { key: randomKey, bubbles: true });
  document.body.dispatchEvent(event);
  console.log(`Simulação de pressionamento de tecla: ${randomKey}`);
}

function simulateScroll() {
  window.scrollBy({
    top: Math.random() * 10,
    behavior: 'smooth'
  });
  console.log("Scroll suave simulado.");
}

function simulateActivity() {
  moveCursorToBottomRight();
  simulateMouseClick();
}

function handleKeyPress(event) {
  const key = event.key;
  const slideIndex = parseInt(key, 10) - 1;

  if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < slides.length) {
    showSlide(slideIndex);
    console.log(`Slide ${key} exibido. Reiniciando temporizador.`);
    resetSlideTimer();
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
