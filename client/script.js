const loginDiv = document.getElementById('login');
const nameInput = document.getElementById('nameInput');
const joinBtn = document.getElementById('joinBtn');
const chatDiv = document.getElementById('chat');
const messagesList = document.getElementById('messages');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const turnDiv = document.getElementById('turn');
const startBtn = document.getElementById('startBtn')

let socket;
let username;

joinBtn.addEventListener('click', () => {
  username = nameInput.value.trim();
  if (!username) return alert('Por favor, escribe un nombre');

  socket = new WebSocket('ws://localhost:3000');

  socket.addEventListener('open', () => {
    socket.send(username);
    loginDiv.style.display = 'none';
    chatDiv.style.display = 'block';
  });

  socket.addEventListener('message', (e) => {
    let data;
    try {
      data = JSON.parse(e.data); // convierte el string en objeto
      const action = data?.action;
      if (action === 'READY') {
        startBtn.classList.remove('hidden');
      }
    } catch (err) {
      console.error('JSON inválido:', e.data);
      return;
    }

    // Caso sin `action`: tratar como mensaje genérico o avisar
    if (typeof data === 'string') {
      const text = e.data;
      addMessage(text);
      if (text.startsWith('Es el turno de')) {
        turnDiv.textContent = text;
        // Si es mi turno, activar input
        if (text.includes(username)) {
          msgInput.disabled = false;
          sendBtn.disabled = false;
        } else {
          msgInput.disabled = true;
          sendBtn.disabled = true;
        }
      }
    }
  });

// Cuando el jugador se desconecta, el botón de start recupera el estado inicial de hidden.
socket.addEventListener('close', () => {
  addMessage(username + ' se ha ido.');
  startBtn.classList.add('hidden');
  startBtn.classList.remove('disabled');
});

sendBtn.addEventListener('click', () => {
  const msg = msgInput.value.trim();
  if (msg) {
    socket.send(msg);
    msgInput.value = '';
  }
});

});

// Cuando el administrador pulsa el botón de inicio, se envía la orden de 'start' al servidor.
startBtn.addEventListener('click', () => {
  let json = { action: 'START' };
  socket.send(JSON.stringify(json));
  startBtn.classList.add('disabled');
})


function addMessage(text) {
  const li = document.createElement('li');
  li.textContent = text;
  messagesList.appendChild(li);
}
