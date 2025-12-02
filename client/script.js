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
  // Mensaje con formato especial para resaltar el fragmento de texto
  if (typeof text === 'string' && text.startsWith('FRAGMSG|')) {
    const parts = text.split('|');
    // Esta parte usa la función FragWord para resaltar el fragmento
    const name = parts[1] || 'Jugador';
    const word = parts[2] || '';
    const fragment = parts[3] || '';

    const li = document.createElement('li');
    const nameSpan = document.createElement('strong');
    nameSpan.textContent = name + ': ';
    // Esta parte usa la función FragWord para resaltar el fragmento
    li.appendChild(nameSpan);
    li.appendChild(FragWord(word, fragment));
    messagesList.appendChild(li);
    return;
  }

  const li = document.createElement('li');
  li.textContent = text;
  messagesList.appendChild(li);
}

// FragWord: devuelve un elemento <span> con el texto completo, resaltando del texto los fragmentos que coinciden con 'fragment'
function FragWord(fullWord, fragment) {
  const span = document.createElement('span');
  if (!fragment) {
    span.textContent = fullWord;
    return span;
  }

  const lw = fullWord.toLowerCase();
  const lf = fragment.toLowerCase();
  let pos = 0, idx;
// Este while busca todas las ocurrencias del fragmento en la palabra completa y las resalta
  while ((idx = lw.indexOf(lf, pos)) !== -1) {
    if (idx > pos) span.append(fullWord.slice(pos, idx));
    const mark = document.createElement('span');
    mark.className = 'frag-font';
    mark.textContent = fullWord.slice(idx, idx + fragment.length);
    span.append(mark);
    pos = idx + fragment.length;
  }
// Si queda texto después de la última ocurrencia, lo añadimos normal
  if (pos < fullWord.length) span.append(fullWord.slice(pos));
  return span;
}
