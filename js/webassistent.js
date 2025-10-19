document.addEventListener("DOMContentLoaded", function () {

  // CHATBOT mit zufälligen Begrüßungen

  const webhookUrl = "https://n8n.novum-software.de/webhook/246f4c72-9dbe-444f-bb81-6e7865afedfe";

  // Mehrere Begrüßungsnachrichten für zufällige Auswahl
  const greetingMessages = {
    de: [
      "Herzlich willkommen bei SKITREFF 👋 \n– dein Experte rund ums Skifahren! ⛷️ Wie können wir dir heute helfen?",
      "Hallo und willkommen! 🎿 \nDein SKITREFF Team ist für dich da. Was möchtest du wissen?",
      "Servus bei SKITREFF! ⛷️ \nBrauchst du Hilfe bei der Auswahl deiner Skiausrüstung?",
      "Willkommen! 🏔️ \nIch bin dein SKITREFF Assistent. Stelle mir gerne deine Fragen zum Thema Ski!",
      "Grüß dich! 👋 \nHier ist dein persönlicher SKITREFF Berater. Womit kann ich dir behilflich sein?",
      "Schön, dass du da bist! ⛷️ \nLass uns gemeinsam deine perfekte Skiausrüstung finden!",
      "Hallo Skifreund! 🎿 \nDein SKITREFF Experte ist bereit. Was interessiert dich heute?",
      "Willkommen im SKITREFF Chat! 🏔️ \nIch helfe dir gerne bei allen Fragen rund ums Skifahren."
    ],
    en: [
      "Welcome to SKITREFF! 👋 \nYour skiing expert is here. How can I help you today? ⛷️",
      "Hello! I'm your SKITREFF assistant. 🎿 \nWhat would you like to know?",
      "Hi there! 🏔️ \nReady to find your perfect ski equipment? I'm here to help!",
      "Welcome! Your personal SKITREFF advisor is ready. ⛷️ \nAsk me anything about skiing!",
      "Greetings! 👋 \nI'm here to help you with all things ski-related. What's on your mind?",
      "Hello ski enthusiast! 🎿 \nLet's find the perfect gear for your next adventure!",
      "Welcome to SKITREFF chat! 🏔️ \nI'm your skiing expert. How may I assist you?",
      "Hi! Ready to hit the slopes? ⛷️ \nI'm here to answer all your skiing questions!"
    ]
  };

  function getRandomGreeting(lang) {
    const messages = greetingMessages[lang] || greetingMessages.de;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  const titles = { de: "Assistent", en: "Assistant" };
  const placeholders = { de: "Nachricht eingeben...", en: "Type a message..." };

  const chatToggle = document.getElementById('chatToggle');
  const chatbox = document.getElementById('chatbox');
  const chatClose = document.getElementById('chatClose');
  const languageSelect = document.getElementById('language');
  const messagesEl = document.getElementById('messages');
  const inputEl = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatTitle = document.getElementById('chat-title');

  if (!chatToggle || !chatbox || !languageSelect || !messagesEl || !inputEl || !sendBtn) {
    console.error('Chat widget: missing required DOM elements');
    return;
  }

  // --- sessionStorage (живёт, пока вкладка открыта) ---
  let currentLang = sessionStorage.getItem('chat_lang') || languageSelect.value || 'de';
  languageSelect.value = currentLang;

  const savedHistory = sessionStorage.getItem('chat_history');
  if (savedHistory) messagesEl.innerHTML = savedHistory;

  function saveChat() {
    sessionStorage.setItem('chat_history', messagesEl.innerHTML);
    sessionStorage.setItem('chat_lang', currentLang);
  }

  // function addMessage(role, text, replaceLastBot = false) {
  //   if (replaceLastBot && role === 'bot') {
  //     const last = messagesEl.lastElementChild;
  //     if (last && last.classList.contains('msg') && last.classList.contains('bot')) {
  //       last.textContent = text;
  //       messagesEl.scrollTop = messagesEl.scrollHeight;
  //       saveChat();
  //       return;
  //     }
  //   }

  //   const div = document.createElement('div');
  //   div.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
  //   div.textContent = text;
  //   messagesEl.appendChild(div);
  //   messagesEl.scrollTop = messagesEl.scrollHeight;
  //   saveChat();
  // }
    function addMessage(role, text, replaceLastBot = false) {
    if (replaceLastBot && role === 'bot') {
      const last = messagesEl.lastElementChild;
      if (last && last.classList.contains('msg') && last.classList.contains('bot')) {
        last.innerHTML = text.replace(/\n/g, '<br>'); 
        messagesEl.scrollTop = messagesEl.scrollHeight;
        saveChat();
        return;
      }
    }

    const div = document.createElement('div');
    div.className = 'msg ' + (role === 'user' ? 'user' : 'bot');

    if (role === 'bot') {      
      div.innerHTML = text.split('\n').map(line => `<div>${line}</div>`).join('');
    } else {
      
      div.textContent = text;
    }

    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    saveChat();
  }


  function greet(forceReplace = false) {
    const text = getRandomGreeting(currentLang);
    if (messagesEl.children.length === 0) {
      addMessage('bot', text);
    } else if (forceReplace) {
      addMessage('bot', text, true);
    }
  }

  async function sendMessage() {
    const message = inputEl.value.trim();
    if (!message) return;

    addMessage('user', message);
    inputEl.value = '';

    let typingDiv;
    const typingTimer = setTimeout(() => {
      typingDiv = document.createElement('div');
      typingDiv.className = 'msg bot typing';
      typingDiv.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(typingDiv);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 500);

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_message: message, lang: currentLang })
      });

      const data = await res.json();

      clearTimeout(typingTimer);
      if (typingDiv) typingDiv.remove();

      addMessage('bot', data.reply || getRandomGreeting(currentLang));
    } catch (err) {
      clearTimeout(typingTimer);
      if (typingDiv) typingDiv.remove();

      console.error('Sending error:', err);
      addMessage('bot', 'Server connection error');
    }
  }

  chatToggle.addEventListener('click', () => {
    chatbox.classList.toggle('active');
    if (chatbox.classList.contains('active')) greet();
  });

  chatClose.addEventListener('click', () => {
    chatbox.classList.remove('active');
  });

  languageSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    sessionStorage.setItem('chat_lang', currentLang);
    messagesEl.innerHTML = '';
    sessionStorage.removeItem('chat_history');
    addMessage('bot', getRandomGreeting(currentLang));
    inputEl.placeholder = placeholders[currentLang] || placeholders.de;
    if (chatTitle) chatTitle.textContent = titles[currentLang] || titles.de;
    greet(true);
  });

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  greet();
});
