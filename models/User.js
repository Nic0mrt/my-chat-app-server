const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
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
  },

  friends: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
});

module.exports = mongoose.model("User", UserSchema);
