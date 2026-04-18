const deck = document.querySelector('.deck');
let cards = Array.from(document.getElementsByClassName('card'));
let openedCards = [];
let matchedPairs = 0;
let movesCount = 0;
let numStars = 3;
let timerStarted = false;
let timerInterval = null;
let totalSeconds = 0;

const movesEl = document.getElementsByClassName("moves")[0];
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
const restartBtn = document.getElementsByClassName('restart')[0];

movesEl.innerHTML = 0;

// Shuffle
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Reordenar cartas en el DOM
function shuffleCards() {
  const shuffled = shuffle(cards.slice());
  shuffled.forEach(card => deck.appendChild(card));
  cards = shuffled;
}

// Timer
function startTimer() {
  timerInterval = setInterval(function () {
    totalSeconds++;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(Math.floor(totalSeconds / 60));
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function pad(val) {
  return val < 10 ? "0" + val : String(val);
}

// Moves + stars
function updateMoves() {
  movesCount++;
  movesEl.innerHTML = movesCount;
  updateStars();
}

function updateStars() {
  const stars = document.getElementsByClassName('fa-star');

  if (movesCount >= 9 && numStars === 3) {
    stars[2].className = "fa fa-star-o";
    numStars = 2;
  } else if (movesCount >= 20 && numStars === 2) {
    stars[1].className = "fa fa-star-o";
    numStars = 1;
  }
}

// Click en carta
function handleCardClick() {
  if (
    this.classList.contains('open') ||
    this.classList.contains('match') ||
    openedCards.length === 2
  ) {
    return;
  }

  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  this.classList.add('open', 'show');
  openedCards.push(this);

  if (openedCards.length === 2) {
    updateMoves();
    checkForMatch();
  }
}

// Revisar match
function checkForMatch() {
  const [card1, card2] = openedCards;

  if (card1.dataset.card === card2.dataset.card) {
    card1.className = "card show match";
    card2.className = "card show match";
    openedCards = [];
    matchedPairs++;

    if (matchedPairs === 8) {
      gameWon();
    }
  } else {
    setTimeout(() => {
      card1.className = "card";
      card2.className = "card";
      openedCards = [];
    }, 700);
  }
}

// Ganar juego
function gameWon() {
  stopTimer();

  setTimeout(() => {
    alert(
      `¡Ganaste! Terminaste en ${movesCount} movimientos, ` +
      `${minutesLabel.innerText}:${secondsLabel.innerText} y ${numStars} estrellas.`
    );
  }, 300);
}

// Reiniciar
function restartGame() {
  stopTimer();
  timerStarted = false;
  totalSeconds = 0;
  minutesLabel.innerHTML = "00";
  secondsLabel.innerHTML = "00";

  matchedPairs = 0;
  movesCount = 0;
  numStars = 3;
  openedCards = [];

  movesEl.innerHTML = 0;

  const starIcons = document.querySelectorAll('.stars i');
  starIcons.forEach(star => {
    star.className = "fa fa-star";
  });

  cards.forEach(card => {
    card.className = "card";
  });

  shuffleCards();
}

// Inicializar
shuffleCards();
cards.forEach(card => {
  card.addEventListener("click", handleCardClick);
});
restartBtn.addEventListener("click", restartGame);
