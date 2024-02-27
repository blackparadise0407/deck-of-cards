/**
 * @typedef Player
 * @prop {string} id
 * @prop {string} name
 * @prop {string} roomId
 */

import getFontSize from "../fontSize";

var fontSize;
var cards_per_player = 3;
var radius = 2;
var whole_circle = 360;

export default {
  deck: function (deck) {
    deck.cao = (players) => deck.queued(cao(players));

    /**
     *
     * @param {Array<Player>} players
     * @returns
     */
    function cao(players = []) {
      if (sessionStorage.getItem("__roomId")) {
        socket.emit("new-game", sessionStorage.getItem("__roomId"));
      }
      deck.queue(function (next) {
        deck.cards.forEach(function (card) {
          setTimeout(function () {
            card.setSide("back");
            card.onFlip = undefined;
          }, 0);
        });
        next();
      });
      const player_count = players.length > 0 ? players.length : 1;
      return function (next) {
        var cards = deck.cards;
        var len = cards.length;
        fontSize = getFontSize();

        cards
          .slice(-player_count * cards_per_player)
          .reverse()
          .forEach(function (card, i) {
            const nextPlayer = players[i % player_count];
            const nextPlayerId = nextPlayer ? nextPlayer.id : null;
            card.cao(player_count, nextPlayerId)(i, len, function (i) {
              const lastTurn = i >= player_count * (cards_per_player - 1);
              card.setSide(lastTurn ? "back" : "front");
              if (nextPlayerId) {
                socket.emit("card-deal", {
                  roomId: sessionStorage.getItem("__roomId"),
                  card,
                  playerId: nextPlayerId,
                });
              }

              if (i === player_count * cards_per_player - 1) {
                next();
              }
            });
          });
      };
    }
  },
  card: function (card) {
    var $el = card.$el;

    card.cao = (player_count, nextPlayerId) =>
      function (i, len, cb) {
        var delay = i * 250;
        const turn = Math.floor(i / player_count) + 1;
        const deg = Math.floor(whole_circle / player_count);
        const x = radius * Math.cos((deg * (i % player_count) * Math.PI) / 180);
        const y = radius * Math.sin((deg * (i % player_count) * Math.PI) / 180);
        card.animateTo({
          delay: delay,
          duration: 250,

          x: Math.round(((x + turn * 0.2) * 120 * fontSize) / 16),
          y: Math.round((y * 100 * fontSize) / 16),
          rot: 0,

          onStart: function () {
            $el.style.zIndex = len - 1 + i;
          },
          onComplete: function () {
            cb(i);
          },
        });
        if (sessionStorage.getItem("__uid") === nextPlayerId) {
          card.onFlip = () => {
            const payload = JSON.parse(JSON.stringify(card));
            payload.roomId = sessionStorage.getItem("__roomId");
            socket.emit("flip-card", payload);
          };
        }
      };
  },
};
