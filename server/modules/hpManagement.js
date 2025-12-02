import { player } from 'player.js';

// Función que chequea el turno jugado, si no fue exitoso (es decir, si no acertó la palabra),
// le resta una vida al jugador correspondiente.
export function checkTurn() {
    if (!success) {
        player.hp -= 1;
    }
}