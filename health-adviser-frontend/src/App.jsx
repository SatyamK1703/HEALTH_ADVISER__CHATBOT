import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Health Advisor. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message
    const userMessage = { id: messages.length + 1, text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get chat history excluding the welcome message
      const chatHistory = messages.slice(1).map(msg => ({
        text: msg.text,
        sender: msg.sender
      }));
      
      // Add loading message
      const loadingId = messages.length + 2;
      setMessages(prev => [...prev, { id: loadingId, text: "Thinking...", sender: 'bot', isLoading: true }]);
      
      // Call backend API
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: chatHistory
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to get response from AI');
      }

      const data = await response.json();
      
      // Replace loading message with actual response
      setMessages(prev => prev.map(msg => 
        msg.id === loadingId 
          ? { id: loadingId, text: data.reply, sender: 'bot' } 
          : msg
      ));
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      setMessages(prev => prev.filter(msg => !msg.isLoading)); // Remove loading message
      setMessages(prev => [...prev, { 
        id: messages.length + 2, 
        text: `Error: ${error.message || "I couldn't process your request. Please try again later."}`, 
        sender: 'bot',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      // Focus the input field after sending a message
      inputRef.current?.focus();
    }
  };

  // Option 1: Custom formatting function that preserves asterisks
  const formatMessageText = (text) => {
    // Split by newlines and preserve asterisks
    return text.split('\n').map((line, index) => {
      // Check if line starts with asterisks (for bullet points)
      if (line.trim().startsWith('*') && !line.trim().startsWith('**')) {
        // It's a bullet point, format accordingly
        return (
          <div key={index} className={index > 0 ? 'mt-2' : ''}>
            <span className="inline-block w-4">•</span>
            <span>{line.trim().substring(1).trim()}</span>
          </div>
        );
      } else if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
        // It's bold text, format accordingly
        const boldText = line.trim().substring(2, line.trim().length - 2);
        return (
          <p key={index} className={index > 0 ? 'mt-2' : ''}>
            <strong>{boldText}</strong>
          </p>
        );
      } else {
        // Regular text
        return (
          <p key={index} className={index > 0 ? 'mt-2' : ''}>
            {line}
          </p>
        );
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-white">Virtual Health Coach</h1>
          </div>
          <div className="text-white text-sm hidden md:block">Your personal health assistant powered by AI</div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : message.isError
                      ? 'bg-red-100 text-red-800 rounded-bl-none shadow'
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center">
                    <span>Thinking</span>
                    <span className="animate-pulse">...</span>
                  </div>
                ) : (
                  typeof message.text === 'string' ? (
                    // Escape literal asterisks at the beginning of lines
                    <div className="whitespace-pre-wrap">
                      {message.text.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : message.text
                )}
              </div>
              
              {message.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white ml-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white shadow-lg border-t border-gray-200">
        <div className="container mx-auto max-w-4xl flex">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your health question here..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            disabled={isLoading || isListening}
          />
          
          {/* Microphone Button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            className={`px-4 py-3 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors disabled:bg-gray-300 flex items-center justify-center`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || input.trim() === '' || isListening}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-r-lg transition-colors disabled:bg-teal-300 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Listening indicator */}
        {isListening && (
          <div className="container mx-auto max-w-4xl mt-2 text-sm text-teal-600 flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            Listening... Speak now
          </div>
        )}
        
        <div className="container mx-auto max-w-4xl mt-2 text-xs text-gray-500 text-center">
          Not a substitute for professional medical advice. For emergencies, please contact your healthcare provider.
        </div>
      </form>
    </div>
  );
}

export default App;




