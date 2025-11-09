import { useState } from 'react';
import './Chatbot.css';

export default function Chatbot({ isOpen, onToggle }) {
  if (!isOpen) return null;
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your study assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (message) => {
    const responses = [
      "That's an interesting question! Let me help you with that.",
      'I can help you find study materials related to that topic.',
      'Would you like me to search for notes on this subject?',
      'Great question! Here are some resources that might help.',
      'I can connect you with classmates who are studying similar topics.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-close" onClick={onToggle}>
        ×
      </button>
      <div className="chatbot-header">
        <div className="bot-info">
          <div className="bot-avatar">🤖</div>
          <div className="bot-details">
            <h3>Study Assistant</h3>
            <span className="status">Online</span>
          </div>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              <p>{message.text}</p>
              <span className="timestamp">{message.timestamp}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message bot">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form className="chatbot-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything about your studies..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}
