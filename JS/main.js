const cards = document.querySelectorAll('.card');
let seHaDadoVuelta = false;
let bloquearTablero = false;
let primeraCarta, segundaCarta;
let emparejar = false;
let timerInterval;
let seconds = 0;

function voltearCarta() {
  if (bloquearTablero || emparejar) return;
  if (this === primeraCarta) return;
  if (this.classList.contains('found')) return;

  startTimer();

  this.classList.add('flipped');

  if (!seHaDadoVuelta) {
    seHaDadoVuelta = true;
    primeraCarta = this;
    return;
  }

  segundaCarta = this;
  hayCoincidencia();
  seHaDadoVuelta = false;
}

function hayCoincidencia() {
  emparejar = true;
  let isMatch = primeraCarta.dataset.framework === segundaCarta.dataset.framework;
  isMatch ? tarjetaDesactivada() : noVoltearCartas();
}

function tarjetaDesactivada() {
  primeraCarta.removeEventListener('click', voltearCarta);
  segundaCarta.removeEventListener('click', voltearCarta);

  primeraCarta.classList.add('found');
  segundaCarta.classList.add('found');

  if (document.querySelectorAll('.card.found').length === cards.length) {
    stopTimer();

    const message = document.createElement('h2');
    message.textContent = 'Has encontrado todas las cartas';
    message.classList.add('texto-final');

    const finalMessage = document.createElement('div');
    finalMessage.setAttribute('id', 'final-message');

    const image = document.createElement('img');
    image.src = './IMG/confeti.gif';

    finalMessage.appendChild(message);
    finalMessage.appendChild(image);

    const button = document.createElement('button');
    button.classList.add('boton-reinicio');
    button.textContent = 'Reiniciar';
    button.setAttribute('id', 'reset-button');
    button.addEventListener('click', resetGame);
    finalMessage.appendChild(button);

    document.getElementById('game-container').appendChild(finalMessage);
  }

  emparejar = false;
}

function noVoltearCartas() {
  emparejar = true;
  bloquearTablero = true;

  setTimeout(() => {
    primeraCarta.classList.remove('flipped');
    segundaCarta.classList.remove('flipped');

    resetearTablero();
    emparejar = false;
  }, 1000);
}

function resetearTablero() {
  [seHaDadoVuelta, bloquearTablero] = [false, false];
  [primeraCarta, segundaCarta] = [null, null];
}

function barajarCartas() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateTimer() {
  const timerElement = document.getElementById('timer');
  timerElement.textContent = secondsToTime(seconds);
}

function secondsToTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;
  return `${padNumber(minutes)}:${padNumber(secondsRemaining)}`;
}

function padNumber(number) {
  return number.toString().padStart(2, '0');
}

function resetGame() {
  stopTimer();

  cards.forEach(card => {
    card.classList.remove('flipped');
    card.classList.remove('found');
    card.addEventListener('click', voltearCarta);
    mostrarCardsTemp()
  });

  const finalMessage = document.getElementById('final-message');
  if (finalMessage) {
    finalMessage.remove();
  }

  barajarCartas();
  seconds = 0;
  updateTimer();

  setTimeout(() => {
    cards.forEach(card => card.classList.remove('flipped'));
    bloquearTablero = false;
  }, 2000);
}

barajarCartas();
mostrarCardsTemp();

function mostrarCardsTemp() {
  cards.forEach(card => {
    card.classList.add('flipped');
  });

  setTimeout(() => {
    cards.forEach(card => {
      card.classList.remove('flipped');
    });
    bloquearTablero = false;
  }, 3000);
}

cards.forEach(card => card.addEventListener('click', voltearCarta));