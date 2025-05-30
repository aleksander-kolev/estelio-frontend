
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

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    // For now, we'll simulate a connection since we don't have a real websocket URL
    // Replace 'ws://localhost:8080' with your actual websocket URL when ready
    const connectWebSocket = () => {
      try {
        // Simulate connection for demo purposes
        setIsConnected(true);
        
        // Add initial bot message
        setMessages([{
          id: 1,
          text: "Здравейте! Как мога да ви помогна с търсенето на имот?",
          sender: "bot",
          timestamp: new Date()
        }]);

        console.log("WebSocket connection simulated");
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
    if (!inputValue.trim() || !isConnected) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response for now
    // Replace this with actual websocket message sending
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: "Благодаря за запитването! В момента работя по намирането на подходящи имоти за вас...",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);

    console.log("Message sent:", inputValue);
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
          Функционален чат - готов за свързване с вашия бот
        </p>
        <div className={`absolute top-2 right-2 h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
      </div>

      <div className="p-4 h-96 flex flex-col overflow-y-auto bg-gray-50">
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
            Връзката не е установена
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatbotDemo;
