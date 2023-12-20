// Función para cambiar de frente a reverso (flip card)
function flipCard() {
    var frontCard = document.getElementById('frontCard');
    var backCard = document.getElementById('backCard');

    if (frontCard && backCard) {
        frontCard.style.display = 'none';
        backCard.style.display = 'flex';
    }
}

// Función para volver al frente (flip card)
function flipBackCard() {
    var frontCard = document.getElementById('frontCard');
    var backCard = document.getElementById('backCard');

    if (frontCard && backCard) {
        backCard.style.display = 'none';
        frontCard.style.display = 'flex';
    }
}
