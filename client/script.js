const loginDiv = document.getElementById('login');
const nameInput = document.getElementById('nameInput');
const joinBtn = document.getElementById('joinBtn');
const difficultyDiv = document.getElementById('difficulty');
const easyBtn = document.getElementById('easyBtn');
const normalBtn = document.getElementById('normalBtn');
const hardBtn = document.getElementById('hardBtn');
const chatDiv = document.getElementById('chat');
const messagesList = document.getElementById('messages');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const turnDiv = document.getElementById('turn');

let socket;
let username;

joinBtn.addEventListener('click', () => {
  username = nameInput.value.trim();
  if (!username) return alert('Por favor, escribe un nombre');

  socket = new WebSocket('ws://localhost:3000');

  socket.addEventListener('open', () => {
    socket.send(username);
    loginDiv.style.display = 'none';
  });

  socket.addEventListener('message', (e) => {
    const text = e.data;

    // Si recibimos el mensaje para seleccionar dificultad
    if (text === 'SELECT_DIFFICULTY') {
      difficultyDiv.style.display = 'block';
      return;
    }

    addMessage(text);

    if (text.includes('Turno de')) {
      turnDiv.textContent = text;
      if (text.includes(username)) {
        msgInput.disabled = false;
        sendBtn.disabled = false;
        msgInput.focus();
      } else {
        msgInput.disabled = true;
        sendBtn.disabled = true;
      }
    }

    // Mostrar chat cuando empiece el juego
    if (text.includes('Dificultad seleccionada')) {
      difficultyDiv.style.display = 'none';
      chatDiv.style.display = 'block';
    }
  });

  socket.addEventListener('close', () => {
    addMessage(username + ' se ha ido.');
  });

  sendBtn.addEventListener('click', () => {
    const msg = msgInput.value.trim();
    if (msg) {
      socket.send(msg);
      msgInput.value = '';
    }
  });

  // Permitir enviar con Enter
  msgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });
});

// Eventos para los botones de dificultad
easyBtn.addEventListener('click', () => {
  socket.send('facil');
});

normalBtn.addEventListener('click', () => {
  socket.send('normal');
});

hardBtn.addEventListener('click', () => {
  socket.send('dificil');
});

function addMessage(text) {
  const li = document.createElement('li');
  li.textContent = text;
  messagesList.appendChild(li);
  messagesList.scrollTop = messagesList.scrollHeight;
}

function chooseDifficulty(){
  // TODO: implementar desplegable de dificultad en index y modificar constante dificultad
  const dificultad = "";

  if (dificultad == "facil") {
    // TODO: Agregar funcion de dificultad facil
  } else if (dificultad == "normal") {
    // TODO: Agregar funcion de dificultad normal
  } else if (dificultad == "dificil") {
    
  }else {dificultad = "normal";}


}