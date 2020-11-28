const express = require('express');

const {
  getConversationById,
  getConversationMessagesById,
  sendMessageToConversation,
} = require('../controllers/conversations');

const router = express.Router();

router
  .route('/:id/messages')
  .get(getConversationMessagesById)
  .post(sendMessageToConversation);
router.route('/:id').get(getConversationById);

module.exports = router;
