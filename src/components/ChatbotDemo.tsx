
import { useState, useEffect, useRef } from "react";
import { User, Bot, Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatbotDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive - only within chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // Connect to local WebSocket server on port 8081
        const ws = new WebSocket('ws://localhost:8081');
        wsRef.current = ws;
        
        ws.onopen = () => {
          console.log("WebSocket connected to localhost:8081");
          setIsConnected(true);
        };
        
        ws.onmessage = (event) => {
          console.log("Received message:", event.data);
          const botMessage: Message = {
            id: Date.now(),
            text: event.data,
            sender: "bot",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        };
        
        ws.onclose = () => {
          console.log("WebSocket connection closed");
          setIsConnected(false);
        };
        
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
        };
        
      } catch (error) {
        console.error("WebSocket connection failed:", error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!inputValue.trim() || !isConnected || !wsRef.current) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Send message to WebSocket server
    wsRef.current.send(inputValue.trim());
    console.log("Message sent:", inputValue);
    
    setInputValue("");
    setIsTyping(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('bg-BG', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="relative bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-sm mx-auto md:mx-0 border border-gray-200">
      <div className="bg-luximo-600 text-white p-4 flex flex-col items-start py-[10px] px-[16px] relative">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-medium">Estelio Асистент</span>
        </div>
        <p className="text-[10px] text-gray-300 italic mt-1 text-left w-full">
          Свързан с localhost:8081
        </p>
        <div className={`absolute top-2 right-2 h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
      </div>

      <div 
        ref={chatContainerRef}
        className="p-4 h-96 flex flex-col overflow-y-auto bg-gray-50 scroll-smooth"
      >
        <div className="flex-grow flex flex-col space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user" 
                  ? "bg-luximo-600 text-white rounded-tr-none" 
                  : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
              }`}>
                <div className="flex items-start gap-2">
                  {message.sender === "bot" && <Bot size={18} className="mt-1 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  {message.sender === "user" && <User size={18} className="mt-1 flex-shrink-0" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-3 rounded-tl-none max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Bot size={18} className="flex-shrink-0" />
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Напишете вашето запитване..." 
            className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-luximo-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
          />
          <button 
            className="bg-luximo-600 text-white p-2 rounded-md hover:bg-luximo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendMessage}
            disabled={!isConnected || !inputValue.trim()}
          >
            <Send size={20} />
          </button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-1">
            Не може да се свърже с localhost:8081
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatbotDemo;
