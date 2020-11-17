const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const NUMBER_OF_HASH = 10;

exports.signup = async (req, res) => {
  try {
    const { pseudo, password, name, firstname, email } = req.body;
    const user = await User.findOne({ pseudo });
    if (user) {
      res.status(401).json({ success: false, error: "Pseudo déjà utilisé" });
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
        expiresIn: "1h",
      }),
    };
    res.status(200).json({ success: true, user: { user: userToSend } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  const { pseudo, password } = req.body;

  try {
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
            expiresIn: "1h",
          }),
        };
        res.status(200).json({ success: true, user: userToSend });
      }
    }
    res.status(401).json({ success: false, error: "Identifiants incorrects" });
  } catch (error) {}
};
