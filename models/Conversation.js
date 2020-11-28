const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  users: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },

  messages: {
    type: [
      {
        author: { type: String },
        text: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },

  lastMessage: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Conversation', ConversationSchema);
