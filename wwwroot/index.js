/* global Deck */

var prefix = Deck.prefix;

var transform = prefix("transform");

var translate = Deck.translate;

var $container = document.getElementById("container");
var $topbar = document.getElementById("topbar");
var $players = document.querySelector("#players>ul");

var $shuffle = document.createElement("button");
var $multiplayer = document.createElement("button");
var $cao = document.createElement("button");

$shuffle.textContent = "Shuffle";
$cao.textContent = "Cào";
$multiplayer.textContent = "Multiplayer";

$topbar.appendChild($shuffle);
$topbar.appendChild($cao);
$topbar.appendChild($multiplayer);

var io;
var MicroModal;
var socket;

var deck = Deck();

deck.cards.forEach(function (card, i) {
  card.enableDragging();
  card.enableFlipping();
});

$shuffle.addEventListener("click", function () {
  deck.shuffle();
  deck.shuffle();
});
$cao.addEventListener("click", function () {
  deck.queue(function (next) {
    deck.cards.forEach(function (card, i) {
      setTimeout(function () {
        card.setSide("back");
      }, i * 7.5);
    });
    next();
  });
  deck.shuffle();
  deck.shuffle();
  deck.cao(window.players)();
});
$multiplayer.addEventListener("click", function () {
  Deck.Utils.enterMultiDialog(sessionStorage.get("__roomId"));
});

deck.mount($container);

// secret message..

var randomDelay = 10000 + 30000 * Math.random();

setTimeout(function () {
  printMessage("Psst..I want to share a secret with you...");
}, randomDelay);

setTimeout(function () {
  printMessage("...try clicking all kings and nothing in between...");
}, randomDelay + 5000);

setTimeout(function () {
  printMessage("...have fun ;)");
}, randomDelay + 10000);

function printMessage(text) {
  var animationFrames = Deck.animationFrames;
  var ease = Deck.ease;
  var $message = document.createElement("p");
  $message.classList.add("message");
  $message.textContent = text;

  document.body.appendChild($message);

  $message.style[transform] = translate(window.innerWidth + "px", 0);

  var diffX = window.innerWidth;

  animationFrames(1000, 700).progress(function (t) {
    t = ease.cubicInOut(t);
    $message.style[transform] = translate(diffX - diffX * t + "px", 0);
  });

  animationFrames(6000, 700)
    .start(function () {
      diffX = window.innerWidth;
    })
    .progress(function (t) {
      t = ease.cubicInOut(t);
      $message.style[transform] = translate(-diffX * t + "px", 0);
    })
    .end(function () {
      document.body.removeChild($message);
    });
}

socket.on("player-join", (players) => {
  window.players = players;
  const html = players.map(({ name }) => `<li><p>${name}</p></li>`).join("");
  $players.innerHTML = html;
});

socket.on("flip-card", ({ pos }) => {
  deck.cards[pos].setSide("front");
});
