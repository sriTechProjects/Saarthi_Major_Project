const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/buyer/chatController');

// GET /chat/history/:buyerId - Get chat history for a buyer
router.get('/history/:buyerId', chatController.getChatHistory);

// GET /chat/user-histories/:buyerId - Get user's chat history sessions
router.get('/user-histories/:buyerId', chatController.getUserHistories);

// POST /chat/message - Add a new message to chat history
router.post('/message', chatController.addMessage);

// POST /chat/process - Process chat query and get response
router.post('/process', chatController.processChat);

// DELETE /chat/session/:sessionId - Delete a specific chat session
router.delete('/session/:sessionId', chatController.deleteSession);

// DELETE /chat/history/:buyerId - Clear chat history for a buyer
router.delete('/history/:buyerId', chatController.clearChatHistory);

module.exports = router;
