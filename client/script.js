const loginDiv = document.getElementById('login');
const nameInput = document.getElementById('nameInput');
const joinBtn = document.getElementById('joinBtn');
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
    chatDiv.style.display = 'block';
  });

  socket.addEventListener('message', (e) => {
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

});


function addMessage(text) {
  const li = document.createElement('li');
  li.textContent = text;
  messagesList.appendChild(li);
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