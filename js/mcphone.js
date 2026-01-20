const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

let currentLang = 'de-DE';
recognition.lang = currentLang;

const micBtn = document.getElementById('micBtn');
const userInput = document.getElementById('userInput');

let isListening = false;
let finalText = '';
let dotsTimer = null;
let languageDetected = false;

/* ===== Language detection ===== */
function detectLanguage(text) {
  const t = text.toLowerCase();

  if (/[а-яё]/.test(t)) return 'ru-RU';
  if (/[äöüß]/.test(t)) return 'de-DE';
  if (/[àâçéèêëîïôûùüÿœæ]/.test(t)) return 'fr-FR';
  if (/[áéíóúñ¿¡]/.test(t)) return 'es-ES';
  if (/[àèéìíîòóù]/.test(t)) return 'it-IT';
  if (/[a-z]/.test(t)) return 'en-US';

  return currentLang;
}

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
  finalText = userInput.value.trim();

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

  // автоопределение языка (один раз)
  if (!languageDetected && (finalText + interim).length > 5) {
    const detectedLang = detectLanguage(finalText + interim);

    if (detectedLang !== recognition.lang) {
      languageDetected = true;
      currentLang = detectedLang;

      recognition.stop();

      setTimeout(() => {
        recognition.lang = detectedLang;
        recognition.start();
      }, 200);

      return;
    }

    languageDetected = true;
  }
};

recognition.onerror = () => {
  stopListening();
};


/*
<script>
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = 'ru-RU';
recognition.continuous = true;
recognition.interimResults = true;

const micBtn = document.getElementById('micBtn');
const userInput = document.getElementById('userInput');

let isListening = false;
let finalText = '';
let dotsInterval = null;

function showDots() {
  let dots = '';
  dotsInterval = setInterval(() => {
    dots = dots.length < 3 ? dots + '●' : '';
    userInput.value = finalText + ' ' + dots;
  }, 350);
}

function hideDots() {
  clearInterval(dotsInterval);
  dotsInterval = null;
}

function startListening() {
  if (isListening) return;

  isListening = true;
  finalText = userInput.value.trim();
  micBtn.classList.add('listening');

  userInput.value = finalText + ' ●';
  showDots();

  try {
    recognition.start();
  } catch (e) {}
}

function stopListening() {
  if (!isListening) return;

  isListening = false;
  micBtn.classList.remove('listening');
  hideDots();
  recognition.stop();
}

micBtn.addEventListener('pointerdown', startListening);
micBtn.addEventListener('pointerup', stopListening);
micBtn.addEventListener('pointerleave', stopListening);
micBtn.addEventListener('pointercancel', stopListening);

recognition.onresult = (event) => {
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      finalText += ' ' + event.results[i][0].transcript;
    }
  }
};

recognition.onerror = () => {
  stopListening();
};
</script>
*/





/*  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error('SpeechRecognition не поддерживается');
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'ru-RU';
  recognition.continuous = true;
  recognition.interimResults = true;

  const micBtn = document.getElementById('micBtn');
  const userInput = document.getElementById('userInput');

  let isListening = false;
  let finalText = '';

  function startListening() {
    if (isListening) return;
    isListening = true;
    finalText = userInput.value || '';
    recognition.start();
    micBtn.classList.add('listening');
  }

  function stopListening() {
    if (!isListening) return;
    isListening = false;
    recognition.stop();
    micBtn.classList.remove('listening');
  }

 
  micBtn.addEventListener('pointerdown', startListening);
  micBtn.addEventListener('pointerup', stopListening);
  micBtn.addEventListener('pointerleave', stopListening);
  micBtn.addEventListener('pointercancel', stopListening);

  recognition.onresult = (event) => {
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

  recognition.onerror = (e) => {
    console.error('Speech error:', e.error);
    stopListening();
  };
*/