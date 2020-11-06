const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io").listen(http);
const PORT = 8000;

let messages = [];

app.use(express.json());
app.use(cors());

app.get("/messages", (req, res) => {
  res.json({ data: messages });
});

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log("message envoyé : " + message);
    messages.push(message);
    io.emit("new-message", messages);
  });
});

http.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
