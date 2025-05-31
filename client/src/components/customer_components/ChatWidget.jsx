import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [userHistories, setUserHistories] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isNewSession, setIsNewSession] = useState(false);
  const [showNewSessionIndicator, setShowNewSessionIndicator] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { currentUser } = useContext(AuthContext);

  // Language translations
  const translations = {
    en: {
      title: "Saarthi Assistant",
      status: "Online • Ready to help",
      welcome: "Welcome to Saarthi Support!",
      welcomeDesc: "Ask me about your orders, products, or anything else.",
      placeholder: "Type your message...",
      send: "Send",
      newChat: "New Chat",
      history: "Chat History",
      noHistory: "No chat history yet",
      noHistoryDesc: "Start a conversation to see your history here",
      loading: "Loading histories...",
      loginRequired: "Please log in to use the chat",
      quickActions: "Quick actions:",
      quickActionItems: ["Check my orders", "Product recommendations", "Return policy"],
      newSessionStarted: "New Chat Session Started",
      deleteConfirm: "Are you sure you want to delete this conversation? This action cannot be undone.",
      deleteError: "Failed to delete conversation. Please try again.",
      networkError: "Error deleting conversation. Please check your connection.",
      msgs: "msgs",
      voiceTooltip: "Voice input",
      listening: "Listening...",
      voiceNotSupported: "Voice input not supported in this browser",
      voiceError: "Voice recognition error. Please try again."
    },
    hi: {
      title: "सार्थी सहायक",
      status: "ऑनलाइन • मदद के लिए तैयार",
      welcome: "सार्थी सपोर्ट में आपका स्वागत है!",
      welcomeDesc: "अपने ऑर्डर, उत्पादों या किसी भी चीज़ के बारे में पूछें।",
      placeholder: "अपना संदेश टाइप करें...",
      send: "भेजें",
      newChat: "नई चैट",
      history: "चैट इतिहास",
      noHistory: "अभी तक कोई चैट इतिहास नहीं",
      noHistoryDesc: "अपना इतिहास यहाँ देखने के लिए बातचीत शुरू करें",
      loading: "इतिहास लोड हो रहा है...",
      loginRequired: "चैट का उपयोग करने के लिए कृपया लॉग इन करें",
      quickActions: "त्वरित कार्य:",
      quickActionItems: ["मेरे ऑर्डर चेक करें", "उत्पाद सुझाव", "वापसी नीति"],
      newSessionStarted: "नया चैट सत्र शुरू हुआ",
      deleteConfirm: "क्या आप वाकई इस बातचीत को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।",
      deleteError: "बातचीत हटाने में विफल। कृपया पुनः प्रयास करें।",
      networkError: "बातचीत हटाने में त्रुटि। कृपया अपना कनेक्शन जांचें।",
      msgs: "संदेश",
      voiceTooltip: "आवाज़ इनपुट",
      listening: "सुन रहा है...",
      voiceNotSupported: "इस ब्राउज़र में आवाज़ इनपुट समर्थित नहीं है",
      voiceError: "आवाज़ पहचान त्रुटि। कृपया पुनः प्रयास करें।"
    }
  };

  // Get current translations
  const t = translations[currentLanguage];

  // Available languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
  ];

  // Hardcoded chat histories for demo
  const hardcodedHistories = [
    {
      id: 1,
      title: "Order Status Inquiry",
      date: "2024-01-15",
      preview: "Can you tell me about my recent order?",
      messages: [
        {
          role: 'user',
          content: 'Can you tell me about my recent order?',
          timestamp: new Date('2024-01-15T10:30:00')
        },
        {
          role: 'assistant',
          content: 'I can help you with that! Your most recent order #12345 was placed on January 14th and is currently being processed. It should ship within 1-2 business days.',
          timestamp: new Date('2024-01-15T10:30:15')
        },
        {
          role: 'user',
          content: 'Great! When will it arrive?',
          timestamp: new Date('2024-01-15T10:31:00')
        },
        {
          role: 'assistant',
          content: 'Based on your shipping address, your order should arrive by January 18th. You\'ll receive a tracking number once it ships.',
          timestamp: new Date('2024-01-15T10:31:20')
        }
      ]
    },
    {
      id: 2,
      title: "Product Recommendation",
      date: "2024-01-14",
      preview: "I need recommendations for organic fruits",
      messages: [
        {
          role: 'user',
          content: 'I need recommendations for organic fruits',
          timestamp: new Date('2024-01-14T15:20:00')
        },
        {
          role: 'assistant',
          content: 'I\'d be happy to recommend some organic fruits! Based on seasonal availability, I suggest organic apples, bananas, and oranges. They\'re fresh and competitively priced.',
          timestamp: new Date('2024-01-14T15:20:30')
        },
        {
          role: 'user',
          content: 'Do you have organic berries?',
          timestamp: new Date('2024-01-14T15:21:00')
        },
        {
          role: 'assistant',
          content: 'Yes! We have organic strawberries and blueberries in stock. They\'re perfect for this season and very popular among our customers.',
          timestamp: new Date('2024-01-14T15:21:25')
        }
      ]
    },
    {
      id: 3,
      title: "Return Policy Question",
      date: "2024-01-13",
      preview: "What's your return policy?",
      messages: [
        {
          role: 'user',
          content: 'What\'s your return policy?',
          timestamp: new Date('2024-01-13T09:15:00')
        },
        {
          role: 'assistant',
          content: 'Our return policy allows returns within 30 days of purchase for most items. Fresh produce has a 3-day return window. Items must be in original condition for a full refund.',
          timestamp: new Date('2024-01-13T09:15:45')
        }
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when widget opens
  useEffect(() => {
    if (isOpen && currentUser?._id) {
      loadChatHistory();
      loadUserHistories();
    }
  }, [isOpen, currentUser]);

  // Auto-hide new session indicator after 5 seconds
  useEffect(() => {
    if (showNewSessionIndicator) {
      const timer = setTimeout(() => {
        setShowNewSessionIndicator(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showNewSessionIndicator]);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageMenu && !event.target.closest('.language-selector')) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageMenu]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // Set language based on current language
      recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognition result:', transcript);
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        alert(t.voiceError);
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Speech recognition ended');
      };

      recognitionRef.current = recognition;
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
      console.log('Speech recognition not supported');
    }

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage, t.voiceError]);

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/saarthi/chat/history/${currentUser._id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.history || []);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadUserHistories = async () => {
    if (!currentUser?._id) return;

    setLoadingHistory(true);
    try {
      const response = await fetch(`http://localhost:8000/api/saarthi/chat/user-histories/${currentUser._id}`);
      if (response.ok) {
        const data = await response.json();
        setUserHistories(data.histories || []);
      }
    } catch (error) {
      console.error('Error loading user histories:', error);
      // Fallback to hardcoded histories if API fails
      setUserHistories(hardcodedHistories);
    } finally {
      setLoadingHistory(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentUser?._id) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // This will trigger the console.log in your backend
      console.log('Sending request to:', 'http://localhost:8000/api/saarthi/chat/process');
      console.log('Request body:', {
        "query": inputMessage,
        "buyer_id": currentUser._id,
        "history": messages,
        "isNewSession": isNewSession
      });

      const response = await fetch('http://localhost:8000/api/saarthi/chat/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "query": inputMessage,
          "buyer_id": currentUser._id,
          "history": messages,
          "isNewSession": isNewSession,
          "language": currentLanguage
        })
      });

      console.log('Response status:', response.status);
      console.log('Response statusText:', response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);

        // Update messages with the complete history from backend
        setMessages(data.history || []);

        // Reset new session flag after first message
        if (isNewSession) {
          setIsNewSession(false);
          console.log('New session created successfully');
        }

        // Refresh user histories to include the new conversation
        loadUserHistories();
      } else {
        console.error('Error sending message:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response body:', errorText);

        // Add error message
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Sorry, I encountered an error (${response.status}). Please try again.`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered a network error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };



  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  };

  const loadHistoryConversation = (historyItem) => {
    setMessages(historyItem.messages);
    setShowHistory(false);
    setIsNewSession(false); // Reset new session flag when loading old conversation
  };

  const startNewChat = () => {
    setMessages([]);
    setShowHistory(false);
    setIsNewSession(true); // Mark as new session
    setShowNewSessionIndicator(true); // Show indicator for 5 seconds
    console.log('Starting new chat session');
  };

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    setShowLanguageMenu(false);
    console.log('Language changed to:', langCode);
  };

  const startVoiceRecognition = () => {
    if (!speechSupported) {
      alert(t.voiceNotSupported);
      return;
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Start listening
      try {
        // Update language before starting
        if (recognitionRef.current) {
          recognitionRef.current.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
          recognitionRef.current.start();
        }
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert(t.voiceError);
      }
    }
  };

  const deleteHistorySession = async (sessionId) => {
    // Show confirmation dialog
    const confirmed = window.confirm(t.deleteConfirm);

    if (!confirmed) {
      return;
    }

    try {
      console.log('Deleting session:', sessionId);

      const response = await fetch(`http://localhost:8000/api/saarthi/chat/session/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Session deleted successfully:', data);

        // Remove the deleted session from local state immediately for better UX
        setUserHistories(prev => prev.filter(history => history.id !== sessionId));

        // Also refresh histories from server to ensure consistency
        loadUserHistories();

        // If the currently displayed conversation is the deleted session, clear it
        const currentSessionId = userHistories.find(h =>
          JSON.stringify(h.messages) === JSON.stringify(messages)
        )?.id;

        if (currentSessionId === sessionId) {
          setMessages([]);
          console.log('Cleared current conversation as it was deleted');
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to delete session:', errorData);
        alert(t.deleteError);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      alert(t.networkError);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button - Modern Design */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110"
      >
        {isOpen ? (
          <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </button>

      {/* Modern Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden backdrop-blur-sm">
          {/* Modern Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t.title}</h3>
                <p className="text-sm opacity-90">{t.status}</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <div className="relative language-selector">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  title="Change Language"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </button>

                {/* Language Dropdown */}
                {showLanguageMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[120px] z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
                          currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                title={t.history}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                onClick={startNewChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                title={t.newChat}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content Area - Messages or History */}
          {showHistory ? (
            /* History Panel */
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t.history}
                </h4>
                <div className="space-y-3">
                  {loadingHistory ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-500">{t.loading}</span>
                    </div>
                  ) : userHistories.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 text-sm">{t.noHistory}</p>
                      <p className="text-gray-400 text-xs mt-1">{t.noHistoryDesc}</p>
                    </div>
                  ) : (
                    userHistories.map((history) => (
                      <div
                        key={history.id}
                        className="bg-white p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => loadHistoryConversation(history)}
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                {history.title}
                              </h5>
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                {history.messageCount} {t.msgs}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {history.preview}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-400">
                                {formatDate(history.date)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(history.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteHistorySession(history.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete conversation"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Messages Panel */
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{t.welcome}</h4>
                  <p className="text-gray-500 text-sm">{t.welcomeDesc}</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                      }`}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex items-end space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isListening && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex items-end space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                      </svg>
                    </div>
                    <div className="bg-red-50 text-red-800 rounded-2xl rounded-bl-md px-4 py-3 border border-red-200 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{t.listening}</span>
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></div>
                          <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1 h-5 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-1 h-7 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Modern Input Section */}
          {!showHistory && (
            <div className="border-t border-gray-100 p-4 bg-white">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={isListening ? t.listening : t.placeholder}
                    className={`w-full border rounded-2xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${
                      isListening
                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    disabled={isLoading || !currentUser?._id}
                  />
                  {/* Voice Input Button */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <button
                      type="button"
                      onClick={startVoiceRecognition}
                      disabled={!currentUser?._id}
                      className={`transition-colors ${
                        isListening
                          ? 'text-red-500 animate-pulse'
                          : speechSupported
                            ? 'text-gray-400 hover:text-blue-600'
                            : 'text-gray-300 cursor-not-allowed'
                      }`}
                      title={isListening ? t.listening : t.voiceTooltip}
                    >
                      {isListening ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading || !currentUser?._id}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-2xl p-3 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                >
                  {isLoading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>

              {!currentUser?._id && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-xs text-yellow-800 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {t.loginRequired}
                  </p>
                </div>
              )}

              {/* New Session Indicator */}
              {showNewSessionIndicator && messages.length === 0 && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm animate-fadeIn">
                    {t.newSessionStarted}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {currentUser?._id && messages.length === 0 && !isNewSession && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">{t.quickActions}</p>
                  <div className="flex flex-wrap gap-2">
                    {t.quickActionItems.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(action)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors duration-200"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
