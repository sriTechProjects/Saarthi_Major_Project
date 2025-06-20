// Test script for the chat API
const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api/saarthi/chat';
const BUYER_ID = '67f52d18cb33ff14bcfd1afb'; // Example buyer ID

async function testChatAPI() {
  try {
    console.log('🚀 Testing Chat API...\n');

    // Test 1: Get initial chat history (should be empty for new user)
    console.log('1. Getting initial chat history...');
    const historyResponse = await axios.get(`${BASE_URL}/history/${BUYER_ID}`);
    console.log('Initial history:', historyResponse.data);
    console.log('✅ Chat history retrieved\n');

    // Test 2: Process a chat query about orders
    console.log('2. Processing chat query about latest order...');
    const chatResponse = await axios.post(`${BASE_URL}/process`, {
      query: "Provide me details about my latest order",
      buyer_id: BUYER_ID
    });
    console.log('Chat response:', chatResponse.data);
    console.log('✅ Chat query processed\n');

    // Test 3: Add a manual message
    console.log('3. Adding a manual message...');
    const messageResponse = await axios.post(`${BASE_URL}/message`, {
      buyerId: BUYER_ID,
      role: 'user',
      content: 'Thank you for the information!'
    });
    console.log('Message added:', messageResponse.data);
    console.log('✅ Manual message added\n');

    // Test 4: Get updated chat history
    console.log('4. Getting updated chat history...');
    const updatedHistoryResponse = await axios.get(`${BASE_URL}/history/${BUYER_ID}`);
    console.log('Updated history:', JSON.stringify(updatedHistoryResponse.data, null, 2));
    console.log('✅ Updated chat history retrieved\n');

    // Test 5: Process another query
    console.log('5. Processing another chat query...');
    const secondChatResponse = await axios.post(`${BASE_URL}/process`, {
      query: "What is the status of my orders?",
      buyer_id: BUYER_ID
    });
    console.log('Second chat response:', secondChatResponse.data);
    console.log('✅ Second chat query processed\n');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing chat API:', error.response?.data || error.message);
  }
}

// Example of how to use the Python Flask endpoint
async function testPythonChatAPI() {
  try {
    console.log('\n🐍 Testing Python Chat API...\n');

    const response = await axios.post('http://localhost:5001/chat-simple', {
      query: "Provide me details about my latest order",
      buyer_id: BUYER_ID
    });

    console.log('Python chat response:', response.data);
    console.log('✅ Python chat API test completed\n');

  } catch (error) {
    console.error('❌ Error testing Python chat API:', error.response?.data || error.message);
  }
}

// Run tests
if (require.main === module) {
  testChatAPI().then(() => {
    // Uncomment the line below to test Python API as well
    // testPythonChatAPI();
  });
}

module.exports = { testChatAPI, testPythonChatAPI };
