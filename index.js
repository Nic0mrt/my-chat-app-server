const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const dotenv = require("dotenv");
const io = require("socket.io").listen(http);
const connectDB = require("./config/db");

//.env config file
dotenv.config({ path: "./config/config.env" });

connectDB();

const PORT = process.env.PORT;

let messages = [];

app.use(express.json());
app.use(cors());

app.get("/messages", (req, res) => {
  res.json({ data: messages });
});

app.use("/users", require("./routes/users"));

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
