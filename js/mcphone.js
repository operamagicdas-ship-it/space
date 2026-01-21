const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true;

const browserLang = navigator.languages?.[0] || navigator.language || 'de-DE';
let currentLang = browserLang;
recognition.lang = currentLang;

const micBtn = document.getElementById('micBtn');
const userInput = document.getElementById('userInput');

let isListening = false;
let finalText = '';
let dotsTimer = null;


/* ===== Dots UI ===== */
function startDots() {
  let dots = '';
  dotsTimer = setInterval(() => {
    if (!isListening) return;
    dots = dots.length < 3 ? dots + '●' : '';
    userInput.value = (finalText ? finalText + ' ' : '') + dots;
  }, 350);
}

function stopDots() {
  clearInterval(dotsTimer);
  dotsTimer = null;
}

/* ===== Control ===== */
function startListening() {
  if (isListening) return;

  isListening = true;
  languageDetected = false;
  //finalText = userInput.value.trim();
  finalText = '';
  micBtn.classList.add('listening');
  startDots();

  try {
    recognition.lang = currentLang;
    recognition.start();
  } catch (e) {}
}

function stopListening() {
  if (!isListening) return;

  isListening = false;
  micBtn.classList.remove('listening');
  stopDots();

  // 🔴 сразу убираем точки
  userInput.value = finalText.trim();

  recognition.stop();
}

/* ===== Pointer events ===== */
micBtn.addEventListener('pointerdown', startListening);
micBtn.addEventListener('pointerup', stopListening);
micBtn.addEventListener('pointerleave', stopListening);
micBtn.addEventListener('pointercancel', stopListening);

/* ===== Results ===== */
recognition.onresult = (event) => {
  if (!isListening) return;

  let interim = '';

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;

    if (event.results[i].isFinal) {
      finalText += transcript + ' ';
    } else {
      interim += transcript;
    }
  }

 
userInput.value = finalText + interim;

};

recognition.onerror = () => {
  stopListening();
};


