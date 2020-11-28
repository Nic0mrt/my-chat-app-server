const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const dotenv = require('dotenv');
const io = require('socket.io').listen(http);
const Conversation = require('./models/Conversation');
const connectDB = require('./config/db');

//.env config file
dotenv.config({ path: './config/config.env' });

connectDB();

const PORT = process.env.PORT;

let messages = [];

app.use(express.json());
app.use(cors());

app.get('/messages', (req, res) => {
  res.json({ data: messages });
});

app.use('/users', require('./routes/users'));
app.use('/conversations', require('./routes/conversations'));

io.on('connection', socket => {
  socket.on('room', room => {
    console.log(typeof room);
    socket.join(room);
    socket.on('sent-message', async object => {
      const id = room;
      const conversation = await Conversation.findById(id);
      let messages = conversation.messages;
      messages.push(object.message);
      await Conversation.updateOne(
        { _id: id },
        { messages: messages },
        { lastMessage: object.message }
      ).select('messages');
      io.in(room).emit('new-message', object.message);

      const receiver = conversation.users.filter(
        user => user.toString() !== object.sender.toString()
      )[0];
      console.log('🚀 ~ file: index.js ~ line 46 ~ receiver', receiver);

      //socket.join(receiver);
      socket.to(receiver).emit('refresh', 'refresh please');
      //socket.leave(reveiver);
    });
  });

  socket.on('user', userId => {
    socket.join(userId);
    console.log(userId + 'connected');
  });
});

http.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
