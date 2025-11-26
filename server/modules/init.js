export function setReady(players){
    let message = {action: "READY"}
    players(0).ws.send(JSON.stringify(message))
}
