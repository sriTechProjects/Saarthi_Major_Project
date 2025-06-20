# Chat API Documentation

This document describes the chat system implementation for the Saarthi e-commerce platform, which includes persistent chat history storage for buyers.

## Overview

The chat system consists of:
1. **Node.js Backend** - Handles chat history storage and basic chat processing
2. **Python Flask Server** - Handles AI-powered chat responses using Ollama
3. **MongoDB Storage** - Persistent storage for chat histories

## API Endpoints

### Node.js Backend (`http://localhost:8000/api/saarthi/chat`)

#### 1. Get Chat History
```http
GET /api/saarthi/chat/history/:buyerId
```

**Response:**
```json
{
  "buyerId": "67f52d18cb33ff14bcfd1afb",
  "history": [
    {
      "role": "user",
      "content": "Provide me details about my latest order",
      "timestamp": "2024-01-15T10:30:00.000Z"
    },
    {
      "role": "assistant", 
      "content": "Here are your recent orders...",
      "timestamp": "2024-01-15T10:30:05.000Z"
    }
  ],
  "lastUpdated": "2024-01-15T10:30:05.000Z"
}
```

#### 2. Add Message to History
```http
POST /api/saarthi/chat/message
```

**Request Body:**
```json
{
  "buyerId": "67f52d18cb33ff14bcfd1afb",
  "role": "user",
  "content": "Thank you for the information!"
}
```

#### 3. Process Chat Query
```http
POST /api/saarthi/chat/process
```

**Request Body:**
```json
{
  "query": "Provide me details about my latest order",
  "buyer_id": "67f52d18cb33ff14bcfd1afb"
}
```

**Response:**
```json
{
  "response": "Here are your recent orders: Order 507f1f77bcf86cd799439011: Product Name x2, Status: placed, Date: 2024-01-15",
  "history": [...],
  "buyer_id": "67f52d18cb33ff14bcfd1afb"
}
```

#### 4. Clear Chat History
```http
DELETE /api/saarthi/chat/history/:buyerId
```

### Python Flask Server (`http://localhost:5001`)

#### 1. AI-Powered Chat (with Ollama)
```http
POST /chat
```

**Request Body:**
```json
{
  "query": "Provide me details about my latest order",
  "buyer_id": "67f52d18cb33ff14bcfd1afb"
}
```

#### 2. Simple Chat (Node.js Backend Proxy)
```http
POST /chat-simple
```

**Request Body:**
```json
{
  "query": "Provide me details about my latest order", 
  "buyer_id": "67f52d18cb33ff14bcfd1afb"
}
```

## Database Schema

### ChatHistory Model
```javascript
{
  buyerId: ObjectId, // Reference to Buyer
  messages: [
    {
      role: String, // 'user' or 'assistant'
      content: String,
      timestamp: Date
    }
  ],
  lastUpdated: Date
}
```

## Usage Examples

### Frontend Integration

```javascript
// Get chat history when user opens chat
const getChatHistory = async (buyerId) => {
  const response = await fetch(`/api/saarthi/chat/history/${buyerId}`);
  return response.json();
};

// Send a message and get response
const sendMessage = async (query, buyerId) => {
  const response = await fetch('/api/saarthi/chat/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, buyer_id: buyerId })
  });
  return response.json();
};

// Example usage
const buyerId = '67f52d18cb33ff14bcfd1afb';
const history = await getChatHistory(buyerId);
const response = await sendMessage('What is my latest order?', buyerId);
```

### Testing

Run the test script:
```bash
node test_chat_api.js
```

## Features

1. **Persistent Storage** - Chat histories are stored in MongoDB and persist across sessions
2. **Order Integration** - Automatically fetches and includes order information in responses
3. **Flexible Architecture** - Supports both AI-powered responses (Python) and simple responses (Node.js)
4. **RESTful API** - Clean, RESTful endpoints for all chat operations
5. **Error Handling** - Comprehensive error handling and validation

## Setup Instructions

1. **Start MongoDB** - Ensure MongoDB is running
2. **Start Node.js Backend** - `npm start` in the server directory
3. **Start Python Flask Server** - `python chat/chatbot_server.py`
4. **Install Dependencies** - `npm install axios` for testing

## Environment Variables

Make sure these are configured:
- MongoDB connection string in Node.js backend
- Ollama URL in Python server (default: `http://localhost:11434/api/generate`)
- Node.js backend URL in Python server (default: `http://localhost:8000/api/saarthi/chat`)

## Notes

- Each buyer has one chat history document
- Messages are automatically timestamped
- The system supports both user and assistant message types
- Chat history is automatically created when first accessed
- Order information is dynamically fetched when queries contain "order" keywords
