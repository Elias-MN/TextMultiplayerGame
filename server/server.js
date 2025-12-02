import { WebSocketServer } from 'ws';
import { fragments } from './constants.js';


// ======== VARIABLES DE JUEGO ========
const wss = new WebSocketServer({ port: 3000 });
const clients = new Map();
let turnOrder = []; // Listado para gestionar los turnos de los jugadores
let currentTurn = 0;
let currentFragment; // Fragmento a utilizar en cada turno
let currentDifficulty = 'normal'; // Dificultad seleccionada
let gameStarted = false; // Control de inicio de partida


// ======== SERVIDOR WEBSOCKET ========
wss.on('connection', (ws) => {

  ws.on('message', (message) => {
    const text = message.toString().trim().toLowerCase();

    // Si el jugador no está registrado
    if (!clients.has(ws)) {
      clients.set(ws, text);
      turnOrder.push(ws);
      broadcast(`${text} se ha unido.`, ws);
      
      // Si es el primer jugador, pedir selección de dificultad
      if (turnOrder.length === 1) {
        ws.send('SELECT_DIFFICULTY');
      }
      return;
    }

    // Si es el primer jugador y no ha empezado el juego, procesar selección de dificultad
    if (!gameStarted && turnOrder[0] === ws && ['easy', 'normal', 'hard'].includes(text)) {
      currentDifficulty = text;
      gameStarted = true;
      broadcast(`🎮 Dificultad seleccionada: ${text.toUpperCase()}`);
      setTimeout(() => announceTurn(), 1000); // Pequeña pausa antes de comenzar
      return;
    }

    // Si el juego no ha comenzado, ignorar mensajes de otros jugadores
    if (!gameStarted) {
      ws.send('⏳ Esperando a que el primer jugador seleccione la dificultad...');
      return;
    }

    // Sólo si es nuestro turno podremos seguir y enviar nuestra respuesta
    const name = clients.get(ws);
    if (turnOrder[currentTurn] !== ws) {
      return;
    }

    // Comprobar si la palabra es válida
    if (!text.includes(currentFragment)) {
      ws.send(`❌ Tu palabra debe contener "${currentFragment}"`);
      return;
    }

    // En caso de ser válida, llegamos a este punto en el que enviamos la respuesta y pasamos turno
    broadcast(`${name}: ${text}`);
    nextTurn();

  });

  ws.on('close', () => {
    const name = clients.get(ws);
    clients.delete(ws);
    // Lo sacamos de la lista de turnos
    turnOrder = turnOrder.filter(c => c !== ws);
    if (name) broadcast(`${name} ha salido.`);

    // Si no queda nadie, resetear el juego
    if (turnOrder.length === 0) {
      gameStarted = false;
      currentDifficulty = 'normal';
      currentTurn = 0;
      return;
    }

    // Ajustar turno si se fue el jugador activo
    if (currentTurn >= turnOrder.length) currentTurn = 0;
    if (turnOrder.length > 0 && gameStarted) announceTurn();

  });

});


// ======== FUNCIONES DE UTILIDAD ========
function broadcast(message) {
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}
// Función para gestionar el nuevo turno
function announceTurn() {
  if (turnOrder.length === 0) return;

  const fragment = randomFragment();
  const currentPlayer = turnOrder[currentTurn];
  const name = clients.get(currentPlayer);

  currentFragment = fragment;

  broadcast(`Turno de ${name} -> ${fragment.toUpperCase()}`);
  currentPlayer.send("🎯 Es tu turno");
}
// Función para incrementar el turno
function nextTurn() {
  currentTurn = (currentTurn + 1) % turnOrder.length;
  announceTurn();
}
// Función para obtener un fragmento aleatorio según la dificultad
function randomFragment() {
  const difficultyFragments = fragments[currentDifficulty];
  return difficultyFragments[Math.floor(Math.random() * difficultyFragments.length)];
}
