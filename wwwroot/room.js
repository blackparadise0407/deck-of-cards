var Deck;

const roomId = location.pathname.split("/").at(-1);

if (!roomId) {
  throw new Error("Room not found");
}

var $container = document.getElementById("container");

// Todo add roomId
Deck.Utils.enterMultiDialog(roomId);

var cards = [];

let turn = 0;

socket.on("card-dealt", ({ card, playerId }) => {
  const $el = document.createElement("div");
  const _card = Deck.Card(card.i);
  _card.mount($el);
  let x = card.x,
    y = card.y;
  _card.setSide(card.side);

  const halfWidth = window.innerWidth / 2;
  const halfHeight = window.innerHeight / 2;
  if (sessionStorage.getItem("__uid") === playerId) {
    x = -halfWidth + 100 + turn * 100;
    y = halfHeight - 100;
    _card.enableFlipping();
    _card.onFlip = (newSide) => {
      socket.emit("flip-card", {
        roomId,
        side: newSide,
        ...card,
      });
    };
    turn += 1;
  }

  _card.animateTo({
    x,
    y,
  });
  cards.push(_card);
  $container.appendChild($el);
});

socket.on("flip-card", ({ rank, suit }) => {
  const idx = cards.findIndex((it) => it.rank === rank && it.suit === suit);
  if (idx > -1 && cards[idx].side !== "front") {
    cards[idx].setSide("front");
  }
});

socket.on("new-game", () => {
  $container.innerHTML = "";
  turn = 0;
  cards = [];
});
