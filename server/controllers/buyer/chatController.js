const ChatHistory = require('../../models/chatHistory');
const Buyer = require('../../models/buyer');
const Order = require('../../models/orders');
const Product = require('../../models/products');

// GET /chat/history/:buyerId - Get chat history for a buyer
exports.getChatHistory = async (req, res) => {
  try {
    const { buyerId } = req.params;

    // Verify buyer exists
    const buyer = await Buyer.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ buyerId });
    if (!chatHistory) {
      chatHistory = new ChatHistory({ buyerId, messages: [] });
      await chatHistory.save();
    }

    res.status(200).json({
      buyerId: chatHistory.buyerId,
      history: chatHistory.messages,
      lastUpdated: chatHistory.lastUpdated
    });
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /chat/message - Add a new message to chat history
exports.addMessage = async (req, res) => {
  try {
    const { buyerId, role, content } = req.body;

    if (!buyerId || !role || !content) {
      return res.status(400).json({ 
        message: 'Missing required fields: buyerId, role, content' 
      });
    }

    if (!['user', 'assistant'].includes(role)) {
      return res.status(400).json({ 
        message: 'Role must be either "user" or "assistant"' 
      });
    }

    // Verify buyer exists
    const buyer = await Buyer.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({ buyerId });
    if (!chatHistory) {
      chatHistory = new ChatHistory({ buyerId, messages: [] });
    }

    // Add new message
    chatHistory.messages.push({
      role,
      content,
      timestamp: new Date()
    });

    await chatHistory.save();

    res.status(201).json({
      message: 'Message added successfully',
      chatHistory: {
        buyerId: chatHistory.buyerId,
        history: chatHistory.messages,
        lastUpdated: chatHistory.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /chat/process - Process chat query and get response
exports.processChat = async (req, res) => {
  try {
    const { query, buyer_id, history, isNewSession, language } = req.body;

    // Console log the exact input format for testing
    console.log({
      "query": query,
      "buyer_id": buyer_id,
      "history": history || [],
      "isNewSession": isNewSession || false,
      "language": language || 'en'
    });

    if (!query || !buyer_id) {
      return res.status(400).json({
        error: "Missing 'query' or 'buyer_id' in request"
      });
    }

    // Verify buyer exists
    const buyer = await Buyer.findById(buyer_id);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    // Get existing chat history
    let chatHistory = await ChatHistory.findOne({ buyerId: buyer_id });
    if (!chatHistory) {
      chatHistory = new ChatHistory({ buyerId: buyer_id, messages: [] });
    }

    // Handle new session logic
    let currentHistory;
    if (isNewSession) {
      // For new sessions, start with empty history but preserve database
      currentHistory = [];
    } else {
      // Use provided history if available, otherwise use database history
      currentHistory = history || chatHistory.messages;
    }

    // Get order information if query is about orders
    let orderContext = "";
    if (query.toLowerCase().includes('order')) {
      try {
        const orders = await Order.find({ buyerId: buyer_id })
          .sort({ orderDate: -1 })
          .populate('items.productId', 'name')
          .limit(5);

        if (orders.length > 0) {
          orderContext = "Here are your recent orders:\n";
          for (const order of orders) {
            const orderDate = order.orderDate.toISOString().split('T')[0];
            orderContext += `- Order ${order._id}: `;
            
            for (const item of order.items) {
              const productName = item.productId?.name || 'Unknown Product';
              orderContext += `${productName} x${item.quantity}, `;
            }
            
            orderContext += `Status: ${order.status}, Date: ${orderDate}\n`;
          }
        } else {
          orderContext = "You have no recent orders.\n";
        }
      } catch (orderError) {
        console.error('Error fetching orders:', orderError);
        orderContext = "Unable to fetch order information at the moment.\n";
      }
    }

    // Prepare response based on language
    let response = "";
    const userLanguage = language || 'en';

    // Generate response based on query and language
    if (query.toLowerCase().includes('latest order') || query.toLowerCase().includes('recent order') ||
        query.includes('मेरे ऑर्डर') || query.includes('ऑर्डर चेक')) {
      if (orderContext.includes('You have no recent orders')) {
        response = userLanguage === 'hi'
          ? "आपके पास कोई हाल के ऑर्डर नहीं हैं। क्या आप हमारे उत्पादों को देखना चाहेंगे?"
          : "You don't have any recent orders. Would you like to browse our products?";
      } else {
        response = userLanguage === 'hi'
          ? `${orderContext}\nक्या इन ऑर्डर के बारे में आप कुछ विशेष जानना चाहते हैं?`
          : `${orderContext}\nIs there anything specific you'd like to know about these orders?`;
      }
    } else if (query.toLowerCase().includes('order status') || query.includes('ऑर्डर स्थिति')) {
      response = userLanguage === 'hi'
        ? `${orderContext}\nआप अपने अकाउंट डैशबोर्ड से अपने ऑर्डर ट्रैक कर सकते हैं। क्या कोई विशेष ऑर्डर है जिसे आप चेक करना चाहते हैं?`
        : `${orderContext}\nYou can track your orders from your account dashboard. Is there a specific order you'd like to check?`;
    } else if (query.toLowerCase().includes('product') || query.toLowerCase().includes('recommend') ||
               query.includes('उत्पाद') || query.includes('सुझाव')) {
      response = userLanguage === 'hi'
        ? "मैं आपको उत्पाद सुझाव देने में खुश हूँ! कृपया बताएं कि आप किस प्रकार के उत्पाद की तलाश में हैं?"
        : "I'd be happy to help with product recommendations! What type of products are you looking for?";
    } else if (query.toLowerCase().includes('return') || query.toLowerCase().includes('refund') ||
               query.includes('वापसी') || query.includes('रिफंड')) {
      response = userLanguage === 'hi'
        ? "हमारी वापसी नीति अधिकांश वस्तुओं के लिए खरीदारी के 30 दिनों के भीतर वापसी की अनुमति देती है। ताजा उत्पादों के लिए 3 दिन की वापसी अवधि है।"
        : "Our return policy allows returns within 30 days of purchase for most items. Fresh produce has a 3-day return window.";
    } else {
      response = userLanguage === 'hi'
        ? "आपके संदेश के लिए धन्यवाद। आज मैं आपकी कैसे मदद कर सकता हूँ? आप मुझसे अपने ऑर्डर, उत्पाद सुझाव या किसी भी अन्य प्रश्न के बारे में पूछ सकते हैं।"
        : "Thank you for your message. How can I help you today? You can ask me about your orders, product recommendations, or any other questions.";
    }

    // Create new messages
    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    const assistantMessage = {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    // Handle session separation
    if (isNewSession) {
      // For new sessions, add a session separator and then the new messages
      const sessionSeparator = {
        role: 'system',
        content: '--- New Chat Session ---',
        timestamp: new Date()
      };

      // Add session separator and new messages to database
      chatHistory.messages.push(sessionSeparator, userMessage, assistantMessage);

      // Return only the new session messages to frontend
      const newSessionHistory = [userMessage, assistantMessage];
      await chatHistory.save();

      return res.status(200).json({
        query,
        buyer_id,
        history: newSessionHistory,
        response,
        isNewSession: true
      });
    } else {
      // Normal flow - update existing conversation
      const updatedHistory = [...currentHistory, userMessage, assistantMessage];

      // Save to database
      chatHistory.messages = updatedHistory;
      await chatHistory.save();

      // Return complete history
      return res.status(200).json({
        query,
        buyer_id,
        history: updatedHistory,
        response
      });
    }

  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /chat/user-histories/:buyerId - Get user's chat history sessions
exports.getUserHistories = async (req, res) => {
  try {
    const { buyerId } = req.params;

    // Verify buyer exists
    const buyer = await Buyer.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    // Get chat history
    const chatHistory = await ChatHistory.findOne({ buyerId });

    if (!chatHistory || !chatHistory.messages.length) {
      return res.status(200).json({ histories: [] });
    }

    // Group messages into conversation sessions
    const histories = groupMessagesIntoSessions(chatHistory.messages, buyerId);

    res.status(200).json({ histories });
  } catch (error) {
    console.error('Error getting user histories:', error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to group messages into conversation sessions
function groupMessagesIntoSessions(messages, buyerId) {
  const sessions = [];
  let currentSession = [];
  let sessionId = 1;

  // Group messages by system separators or time gaps
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const prevMessage = messages[i - 1];

    // Start new session if:
    // 1. System separator message
    // 2. Time gap > 30 minutes
    // 3. First message
    if (message.role === 'system' && message.content.includes('New Chat Session')) {
      // Save previous session if it exists
      if (currentSession.length > 0) {
        sessions.push(createSessionObject(currentSession, sessionId++, buyerId));
      }

      // Start new session (skip the system message)
      currentSession = [];
    } else if (!prevMessage ||
        (new Date(message.timestamp) - new Date(prevMessage.timestamp)) > 30 * 60 * 1000) {

      // Save previous session if it exists
      if (currentSession.length > 0) {
        sessions.push(createSessionObject(currentSession, sessionId++, buyerId));
      }

      // Start new session
      currentSession = [message];
    } else {
      // Add to current session (skip system messages)
      if (message.role !== 'system') {
        currentSession.push(message);
      }
    }
  }

  // Add the last session
  if (currentSession.length > 0) {
    sessions.push(createSessionObject(currentSession, sessionId, buyerId));
  }

  return sessions.reverse(); // Most recent first
}

// Helper function to create session object
function createSessionObject(messages, sessionId, buyerId) {
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  const sessionDate = new Date(messages[0].timestamp);

  // Generate title based on first user message
  let title = 'Chat Session';
  if (firstUserMessage) {
    const content = firstUserMessage.content.toLowerCase();
    if (content.includes('order')) {
      title = 'Order Inquiry';
    } else if (content.includes('product') || content.includes('recommend')) {
      title = 'Product Question';
    } else if (content.includes('return') || content.includes('refund')) {
      title = 'Return/Refund';
    } else if (content.includes('help') || content.includes('support')) {
      title = 'Support Request';
    } else {
      title = 'General Chat';
    }
  }

  return {
    id: `${buyerId}_${sessionId}_${sessionDate.getTime()}`,
    title,
    date: sessionDate.toISOString().split('T')[0],
    preview: firstUserMessage ? firstUserMessage.content.substring(0, 60) + '...' : 'Chat session',
    messages,
    messageCount: messages.length,
    lastUpdated: new Date(messages[messages.length - 1].timestamp)
  };
}

// DELETE /chat/session/:sessionId - Delete a specific chat session
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Parse sessionId to extract buyerId and session info
    const [buyerId, sessionNumber, timestamp] = sessionId.split('_');

    if (!buyerId) {
      return res.status(400).json({ message: 'Invalid session ID format' });
    }

    // Verify buyer exists
    const buyer = await Buyer.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    // Get chat history
    const chatHistory = await ChatHistory.findOne({ buyerId });
    if (!chatHistory) {
      return res.status(404).json({ message: 'Chat history not found' });
    }

    // Group messages into sessions to find the target session
    const sessions = groupMessagesIntoSessions(chatHistory.messages, buyerId);
    const targetSession = sessions.find(session => session.id === sessionId);

    if (!targetSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Remove messages belonging to this session from the database
    const sessionMessages = targetSession.messages;
    const sessionStartTime = new Date(sessionMessages[0].timestamp);
    const sessionEndTime = new Date(sessionMessages[sessionMessages.length - 1].timestamp);

    // Filter out messages from this session (including system separators)
    const updatedMessages = chatHistory.messages.filter(message => {
      const messageTime = new Date(message.timestamp);

      // Remove messages within the session time range
      if (messageTime >= sessionStartTime && messageTime <= sessionEndTime) {
        return false;
      }

      // Also remove system separators that might be related to this session
      if (message.role === 'system' &&
          message.content.includes('New Chat Session') &&
          Math.abs(messageTime - sessionStartTime) < 60000) { // Within 1 minute
        return false;
      }

      return true;
    });

    // Update the chat history
    chatHistory.messages = updatedMessages;
    await chatHistory.save();

    res.status(200).json({
      message: 'Session deleted successfully',
      deletedSessionId: sessionId
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE /chat/history/:buyerId - Clear chat history for a buyer
exports.clearChatHistory = async (req, res) => {
  try {
    const { buyerId } = req.params;

    // Verify buyer exists
    const buyer = await Buyer.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    // Clear chat history
    await ChatHistory.findOneAndUpdate(
      { buyerId },
      { messages: [], lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: error.message });
  }
};
