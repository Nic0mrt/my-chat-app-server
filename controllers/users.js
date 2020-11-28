const User = require('../models/User');
const Conversation = require('../models/Conversation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const NUMBER_OF_HASH = 10;

function isConversationExist(_arr1, _arr2) {
  if (
    !Array.isArray(_arr1) ||
    !Array.isArray(_arr2) ||
    _arr1.length !== _arr2.length
  ) {
    return false;
  }

  const arr1 = _arr1.concat().sort();
  const arr2 = _arr2.concat().sort();

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

exports.signup = async (req, res) => {
  try {
    const { pseudo, password, name, firstname, email } = req.body;
    const user = await User.findOne({ pseudo });
    if (user) {
      res.status(401).json({ success: false, error: 'Pseudo déjà utilisé' });
    }

    const hash = await bcrypt.hash(password, NUMBER_OF_HASH);

    const userToSave = new User({
      pseudo: pseudo,
      password: hash,
      name,
      firstname,
      email,
    });

    const userSaved = await userToSave.save();

    const userToSend = {
      _id: userSaved._id,
      pseudo: userSaved.pseudo,
      name: userSaved.name,
      firstname: userSaved.firstname,
      friends: userSaved.friends,
      admin: userSaved.admin,
      token: jwt.sign({ _id: userSaved._id }, process.env.RANDOM_TOKEN_SECRET, {
        expiresIn: '1h',
      }),
    };
    res.status(200).json({ success: true, user: { user: userToSend } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { pseudo, password } = req.body;
    const user = await User.findOne({ pseudo });

    if (user) {
      const pwdValid = await bcrypt.compare(password, user.password);
      if (pwdValid) {
        const userToSend = {
          _id: user._id,
          pseudo: user.pseudo,
          name: user.name,
          firstname: user.firstname,
          friends: user.friends,
          admin: user.admin,
          token: jwt.sign({ _id: user._id }, process.env.RANDOM_TOKEN_SECRET, {
            expiresIn: '1h',
          }),
        };

        res.status(200).json({ success: true, user: userToSend });
      }
    }
    res.status(401).json({ success: false, error: 'Identifiants incorrects' });
  } catch (error) {}
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().sort({ pseudo: 1 }).populate('conversations');
  res.json({ success: true, users: users });
};

exports.getConversation = async (req, res) => {
  try {
    const { senderId } = req.params;
    const { userId } = req.body;

    const sender = await User.findById(senderId).populate('conversations');
    const friend = await User.findById(userId);

    if (sender.conversations.length > 0) {
      const conversationFound = sender.conversations.filter(conversation => {
        return isConversationExist(
          [conversation.users[0].toString(), conversation.users[1].toString()],
          [sender._id.toString(), friend._id.toString()]
        );
      });

      res.json({
        success: true,
        exist: conversationFound.length > 0 ? true : false,
        conversation: conversationFound.length > 0 ? conversationFound : null,
      });
    } else {
      res.json({
        success: true,
        exist: false,
      });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.getConversationsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json({ success: true, conversations: user.conversations });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
