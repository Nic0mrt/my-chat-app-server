const Conversation = require('../models/Conversation');

exports.getConversationById = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id)
      .select('-messages')
      .populate('users', '-admin -password');

    res.json({ success: true, conversation });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.getConversationMessagesById = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id).select('messages');

    res.json({ success: true, messages: conversation.messages });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

exports.sendMessageToConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    console.log('🚀 ~ file: conversations.js ~ line 33 ~ message', message);
    const conversation = await Conversation.findById(id);
    let messages = conversation.messages;

    messages.push(message);

    await Conversation.updateOne({ _id: id }, { messages: messages }).select(
      'messages'
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
