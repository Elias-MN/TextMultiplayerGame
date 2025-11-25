import { WebSocketServer } from 'ws';
import { fragments } from './constants.js';


// ======== VARIABLES DE JUEGO ========
const wss = new WebSocketServer({ port: 3000 });
const clients = new Map();
let turnOrder = []; // Listado para gestionar los turnos de los jugadores
let currentTurn = 0;
let currentFragment; // Fragmento a utilizar en cada turno


// ======== SERVIDOR WEBSOCKET ========
wss.on('connection', (ws) => {

  ws.on('message', (message) => {
    const text = message.toString().trim().toLowerCase();

    let contador = 5; 
    
    if (!clients.has(ws)) {
      clients.set(ws, text);
      // Lo añadimos a la lista de turnos
      turnOrder.push(ws);
      broadcast(`${text} se ha unido.`, ws);
      // Si es el primer jugador, comenzar partida
      if (turnOrder.length === 1) announceTurn();
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

    // Ajustar turno si se fue el jugador activo
    if (currentTurn >= turnOrder.length) currentTurn = 0;
    if (turnOrder.length > 0) announceTurn();

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
// Función para obtener un fragmento aleatorio
function randomFragment() {
  return fragments[Math.floor(Math.random() * fragments.length)];
}
