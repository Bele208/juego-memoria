const cards = document.querySelectorAll('.card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matching = false;

function flipCard() {
  if (lockBoard || matching) return;
  if (this === firstCard) return;
  if (this.classList.contains('found')) return; // Esto es una verificación

  this.classList.add('flipped');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
  hasFlippedCard = false; 
}

function checkForMatch() {
  matching = true;
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  // Se agrega una clase a las tarjetas encontradas para mantenerlas boca arriba
  firstCard.classList.add('found');
  secondCard.classList.add('found');

  //Este es el mensaje que apareche al dar vuelta todas las cartas
if (document.querySelectorAll('.card.found').length === cards.length) {
    const message = document.createElement('h2');
    message.textContent = 'Has encontrado todas las cartas';
    message.classList.add('texto-final');
  
    const finalMessage = document.createElement('div');
    finalMessage.setAttribute('id', 'final-message');
  
    const image = document.createElement('img');
    image.src = './IMG/confeti.gif';
  
    finalMessage.appendChild(message);
    finalMessage.appendChild(image);
  
    // Agregar el botón de reinicio
    const button = document.createElement('button');
    button.classList.add('boton-reinicio')
    button.textContent = 'Reiniciar';
    button.setAttribute('id', 'reset-button');
    button.addEventListener('click', resetGame);
    finalMessage.appendChild(button);
  
    // Agregar el mensaje final y el botón al contenedor del juego
    document.getElementById('game-container').appendChild(finalMessage);
  }
  
  function resetGame() {
    // Vuelve a cargar la página para reiniciar el juego
    location.reload();
  }
  
  matching = false;
}

function unflipCards() {
  matching = true;
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');

    resetBoard();
    matching = false;
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));