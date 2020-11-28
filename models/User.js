const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    select: false,
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
  },

  firstname: {
    type: String,
  },

  admin: {
    type: Boolean,
    default: false,
    select: false,
  },

  conversations: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
      },
    ],
  },

  avatar: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
