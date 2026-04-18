let ul = document.querySelector('ul.deck'); // idea from stackoverflow 7070054
let score = 0;
let cards = document.getElementsByClassName('card');
let opened_cards = [];
document.getElementsByClassName("moves")[0].innerHTML = 0; // sets number of moves at 0
let order = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]); // creates a random index
let num_stars=3; // number of stars


var minutesLabel = document.getElementById("minutes"); //stackoverflow 5517597
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
const times=[];
localStorage.setItem("times", times);

function startTimer() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

function shuffle(array) { // given shuffle function
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



for (var i = ul.children.length - 1; i >= 0; i--) { // asigns the random index value to every listed element
  ul.appendChild(ul.children[order[i]]);
}

for (i = 0; i < 16; i++) { // creates an event listener for every clicked card
  cards[i].place = [order[i], i];
  cards[i].addEventListener("click", clicked);
};

function clicked() {
  this.className = "card show open";
  return opened(this.childNodes[1].className, this.place);
}

function opened(name, index) { // analyzes if the cards match or not, and based on that changes styles.
  opened_cards.push([name, index[1]]);
  if(opened_cards.length===1){
    setInterval(startTimer, 1000);
  }
  if (opened_cards.length % 2 === 1) {
    index1 = opened_cards[opened_cards.length - 1][1];
    cards[index1].removeEventListener("click", clicked);
  } else if (opened_cards.length % 2 === 0 && (opened_cards[opened_cards.length - 1][0] === opened_cards[opened_cards.length - 2][0])) {
    a = document.getElementsByClassName(opened_cards[opened_cards.length - 1][0]);
    a[0].parentNode.className = "card show match";
    a[1].parentNode.className = "card show match";
    index1 = opened_cards[opened_cards.length - 1][1];
    index2 = opened_cards[opened_cards.length - 2][1];
    cards[index1].removeEventListener("click", clicked);
    cards[index2].removeEventListener("click", clicked);
    scores();
    moves();
  } else if (opened_cards.length % 2 === 0 && (opened_cards[opened_cards.length - 1][0] != opened_cards[opened_cards.length - 2][0])) {
    index1 = opened_cards[opened_cards.length - 1][1];
    index2 = opened_cards[opened_cards.length - 2][1];
    cards[index1].className = "card shake-constant shake-horizontal";
    cards[index2].className = "card shake-constant shake-horizontal";

    setTimeout(turnback, 200);
  }
};

function turnback() {
  cards[index1].className = "card";
  cards[index2].className = "card";
  cards[index1].addEventListener("click", clicked);
  cards[index2].addEventListener("click", clicked);
  moves();
}


let j = 1;

function moves() { // counter of moves
  move = document.getElementsByClassName("moves")[0].innerHTML = j++;
  starss=document.getElementsByClassName('fa-star');
  stars(move);
};

function scores() { // Sends a message after a player won.
  score = score + 1;
  if (score === 8) {
    document.getElementsByClassName("container")[0].className = "container won";
    setTimeout(function() {
      const myPara = document.createElement('p');
      minutes=document.getElementById("minutes").innerText;
      seconds=document.getElementById("seconds").innerText;
      total_time=Number(minutes)*60+Number(seconds);
      times.push=total_time;
      myPara.textContent = "You won" + " with " + move + " moves, "+ minutes + " minutes, "+ seconds + " seconds and " + num_stars + " stars";
      document.body.appendChild(myPara);
    }, 500);
    var x = document.createElement("BUTTON");
    document.body.appendChild(x);
    x.appendChild(document.createTextNode('Play again!'));
    x.addEventListener("click", again);
  }
};

function stars(moves){ // Correction according to last review: stars cannot be zero
  if(moves===9){
    starss[2].className="fa fa-star-o";
    num_stars=2;
  }else if(moves===20){
    starss[1].className="fa fa-star-o";
    num_stars=1;
  }
}

z = document.getElementsByClassName('restart');
z[0].addEventListener("click", again);

function again() { // Reload a game.
  location.reload();
  };
