//Funcion para no repetir las mismas palabras
function wordUsed(word) {
    if (wordPlayed.has(word)) {
        return true;       // ya usada
    }

    wordPlayed.add(word); // la marcamos como usada
    console.log("Palabras usadas", wordPlayed);
    return false;

}