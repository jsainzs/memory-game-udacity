const deck = document.querySelector(".deck");
const movesEl = document.querySelector(".moves");
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
const restartBtn = document.querySelector(".restart");
const deckButtons = Array.from(document.querySelectorAll(".deck-option"));

const MEMORY_DECKS = {
  jerseys: {
    name: "Camisetas históricas",
    columns: 4,
    cards: [
      { id: "1916", type: "image", src: "img/jersey_1916.png", alt: "Jersey América 1916" },
      { id: "80s", type: "image", src: "img/80s.png", alt: "Jersey América años 80" },
      { id: "reynoso", type: "image", src: "img/reynoso.png", alt: "Carlos Reinoso" },
      { id: "chanfle", type: "image", src: "img/chanfle.png", alt: "El Chanfle" },
      { id: "tri", type: "image", src: "img/tri.png", alt: "América tricampeón" },
      { id: "cuau", type: "image", src: "img/cuau.png", alt: "Cuauhtémoc Blanco" },
      { id: "cent", type: "image", src: "img/cent_2016.png", alt: "Centenario América 2016" },
      { id: "blanca", type: "image", src: "img/blanca.png", alt: "Jersey blanco América" }
    ]
  },
  titles: {
    name: "Títulos de liga",
    columns: 6,
    cards: [
      { id: "la-5", type: "title", title: "La 5a", detail: "América-Chivas · 1984-1985" },
      { id: "la-6", type: "title", title: "La 6a", detail: "América-Tampico Madero · PRODE 1985" },
      { id: "la-7", type: "title", title: "La 7a", detail: "América-Pumas · 1987-1988" },
      { id: "la-8", type: "title", title: "La 8a", detail: "América-Cruz Azul · 1988-1989" },
      { id: "la-9", type: "title", title: "La 9a", detail: "América-Necaxa · Verano 2002" },
      { id: "la-10", type: "title", title: "La 10a", detail: "América-Tecos · Clausura 2005" },
      { id: "la-11", type: "title", title: "La 11a", detail: "América-Cruz Azul · Clausura 2013" },
      { id: "la-12", type: "title", title: "La 12a", detail: "América-Tigres · Apertura 2014" },
      { id: "la-13", type: "title", title: "La 13a", detail: "América-Cruz Azul · Apertura 2018" },
      { id: "la-14", type: "title", title: "La 14a", detail: "América-Tigres · Apertura 2023" },
      { id: "la-15", type: "title", title: "La 15a", detail: "América-Cruz Azul · Clausura 2024" },
      { id: "la-16", type: "title", title: "La 16a", detail: "América-Monterrey · Apertura 2024" }
    ]
  }
};

let cards = [];
let openedCards = [];
let matchedPairs = 0;
let movesCount = 0;
let numStars = 3;
let timerStarted = false;
let timerInterval = null;
let totalSeconds = 0;
let currentDeckId = "jerseys";

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function pad(val) {
  return val < 10 ? "0" + val : String(val);
}

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

function getCurrentDeck() {
  return MEMORY_DECKS[currentDeckId];
}

function getTargetPairs() {
  return getCurrentDeck().cards.length;
}

function createCard(cardData) {
  const card = document.createElement("li");
  card.className = "card";
  card.dataset.card = cardData.id;

  if (cardData.type === "image") {
    const img = document.createElement("img");
    img.className = "card-img";
    img.src = cardData.src;
    img.alt = cardData.alt;
    card.appendChild(img);
  } else {
    const content = document.createElement("div");
    content.className = "card-title-content";
    content.innerHTML = `
      <strong>${cardData.title}</strong>
      <span>${cardData.detail}</span>
    `;
    card.appendChild(content);
  }

  card.addEventListener("click", handleCardClick);
  return card;
}

function buildDeck(deckId) {
  currentDeckId = deckId;
  const selectedDeck = getCurrentDeck();
  const duplicatedCards = selectedDeck.cards.flatMap(card => [card, card]);

  deck.innerHTML = "";
  deck.style.setProperty("--deck-columns", selectedDeck.columns);

  shuffle(duplicatedCards.slice()).forEach(cardData => {
    deck.appendChild(createCard(cardData));
  });

  cards = Array.from(document.getElementsByClassName("card"));
}

function updateDeckButtons() {
  deckButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.deck === currentDeckId);
  });
}

function resetStats() {
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

  document.querySelectorAll(".stars i").forEach(star => {
    star.className = "fa fa-star";
  });
}

function updateMoves() {
  movesCount++;
  movesEl.innerHTML = movesCount;
  updateStars();
}

function updateStars() {
  const stars = document.getElementsByClassName("fa-star");
  const pairCount = getTargetPairs();
  const twoStarLimit = pairCount === 12 ? 18 : 9;
  const oneStarLimit = pairCount === 12 ? 32 : 20;

  if (movesCount >= twoStarLimit && numStars === 3) {
    stars[2].className = "fa fa-star-o";
    numStars = 2;
  } else if (movesCount >= oneStarLimit && numStars === 2) {
    stars[1].className = "fa fa-star-o";
    numStars = 1;
  }
}

function handleCardClick() {
  if (
    this.classList.contains("open") ||
    this.classList.contains("match") ||
    openedCards.length === 2
  ) {
    return;
  }

  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  this.classList.add("open", "show");
  openedCards.push(this);

  if (openedCards.length === 2) {
    updateMoves();
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = openedCards;

  if (card1.dataset.card === card2.dataset.card) {
    card1.className = "card show match";
    card2.className = "card show match";
    openedCards = [];
    matchedPairs++;

    if (matchedPairs === getTargetPairs()) {
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

function gameWon() {
  stopTimer();

  setTimeout(() => {
    alert(
      `¡Ganaste el memorama de ${getCurrentDeck().name}! Terminaste en ${movesCount} movimientos, ` +
      `${minutesLabel.innerText}:${secondsLabel.innerText} y ${numStars} estrellas.`
    );
  }, 300);
}

function restartGame() {
  resetStats();
  buildDeck(currentDeckId);
  updateDeckButtons();
}

function selectDeck(deckId) {
  resetStats();
  buildDeck(deckId);
  updateDeckButtons();
}

deckButtons.forEach(button => {
  button.addEventListener("click", () => selectDeck(button.dataset.deck));
});

restartBtn.addEventListener("click", restartGame);
buildDeck(currentDeckId);
updateDeckButtons();
