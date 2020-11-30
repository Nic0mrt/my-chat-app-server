const express = require('express');

const {
  signup,
  login,
  getAllUsers,
  getUserInfo,
  getConversation,
  getConversationsByUserId,
  decriptToken,
} = require('../controllers/users');

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/token').post(decriptToken);
router.route('/:senderId/conversation').get(getConversation);
router.route('/:id/conversations').get(getConversationsByUserId);
router.route('/:id').get(getUserInfo);
router.route('/').get(getAllUsers);

module.exports = router;
