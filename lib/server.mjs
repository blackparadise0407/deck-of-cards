/**
 * @typedef Card
 * @prop {number} i
 * @prop {number} rank
 * @prop {number} suit
 * @prop {number} pos
 * @prop {number} x
 * @prop {number} y
 * @prop {number} rot
 * @prop {'front' | 'back'} side
 */

import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const players = new Map();

app.set("view engine", "jade");

app.use(express.static(path.resolve("wwwroot")));

app.get("/", (_, res) => {
  res.render("index");
});

app.get("/cao/:roomId", (req, res) => {
  res.render("room", { title: req.params.roomId });
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);

  socket.on("join-room", ({ roomId, player }) => {
    players.set(player.id, { ...player, roomId });
    socket.join(roomId);
  });

  socket.on("card-deal", ({ roomId, card, playerId }) => {
    const player = players.get(playerId);
    if (!player) {
      return;
    }
    const cards = player.cards ?? [];
    players.set(playerId, { ...player, cards: [...cards, card] });
    io.in(roomId).emit("card-dealt", { card, playerId });
  });

  socket.on("flip-card", (payload) => {
    console.log(payload);
    io.in(payload.roomId).emit("flip-card", payload);
  });

  socket.on("new-game", (roomId) => {
    socket.to(roomId).emit("new-game");
  });

  io.of("/").adapter.on("join-room", (roomId) => {
    io.in(roomId).emit(
      "player-join",
      mapToArray(players).filter((it) => it.roomId === roomId)
    );
  });

  socket.on("disconnect", (reason) => {
    console.log(`user ${socket.id} disconnected with reason ${reason}`);
  });
});

/**
 *
 * @param {Map<string, any>} map
 */
function mapToArray(map) {
  return Array.from(map, ([, value]) => value);
}

server.listen(8080);
