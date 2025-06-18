import { useState, useEffect, useRef } from "react";
import { Settings } from "lucide-react";
import ChatMessage from "./chatbot/ChatMessage";
import QuickReplies from "./chatbot/QuickReplies";
import TypingIndicator from "./chatbot/TypingIndicator";
import ChatInput from "./chatbot/ChatInput";
import UserInfoModal from "./chatbot/UserInfoModal";
import SettingsPanel from "./chatbot/SettingsPanel";
import { Message, LeadCaptureData } from "./chatbot/types";
import { generateQuickReplies } from "./chatbot/utils";

export type { LeadCaptureData } from "./chatbot/types";

export default function ChatbotDemo() {  // Initial welcome message from bot
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "**Добре дошли в Estelio!** 🏠\n\nАз съм вашият персонален асистент за недвижими имоти. Мога да ви помогна да:\n• Търсите имоти по ваши критерии\n• Получите детайлна информация за конкретни имоти\n• Свържа ви с агенти\n\nИзберете едно от предложенията по-долу или опишете какво търсите:",
      sender: "bot",
      timestamp: new Date(),
      propertyMetadata: {
        propertyIds: [],
        propertyType: "search" as const,
        basicInfo: {}
      }
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const [leadData, setLeadData] = useState<LeadCaptureData | null>(null);const [quickReplies, setQuickReplies] = useState<string[]>([
    "Търся апартамент в София",
    "Покажи ми къщи в Пловдив", 
    "Имоти до 200,000 EUR",
    "Най-новите обяви"
  ]); // Initial suggestions
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // Function to handle quick reply selection
  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    // Hide quick replies when user selects one
    setShowQuickReplies(false);
    // Auto-send the quick reply
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const scrollToMessage = (messageId: number) => {
    setTimeout(() => {
      const messageElement = document.querySelector(`[data-message-id="${messageId}"]`) as HTMLElement;
      if (messageElement && chatContainerRef.current) {
        // Use scrollIntoView for more reliable positioning
        messageElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  };
  // Update quick replies when new bot message arrives
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === "bot") {
      // Don't generate new quick replies for the initial welcome message
      if (lastMessage.id === 0) return;
      
      const newQuickReplies = generateQuickReplies(lastMessage);
      setQuickReplies(newQuickReplies);
    } else if (lastMessage && lastMessage.sender === "user") {
      // Hide quick replies when user sends a message
      setQuickReplies([]);
      // Scroll to bottom for user messages 
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [isTyping]);

  // Lead capture form handlers  const handleLeadCaptureSubmit = (data: LeadCaptureData) => {
    setLeadData(data);
    setShowUserInfoModal(false);
    
    // Send the pending message with lead data
    if (pendingMessage) {
      sendMessageWithData(pendingMessage, data);
      setPendingMessage("");
    }
  };

  const handleLeadCaptureSkip = () => {
    setShowUserInfoModal(false);
    
    // Send the pending message without lead data
    if (pendingMessage) {
      sendMessageWithData(pendingMessage, null);
      setPendingMessage("");
    }
  };

  const handleSettingsSave = (data: LeadCaptureData) => {
    setLeadData(data);
    setShowSettingsPanel(false);
  };
  const sendMessageWithData = async (message: string, userData: LeadCaptureData | null) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: messages.slice(-5).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'API request failed');
      }      // Add bot response with proper structure from API.md
      const botMessage: Message = {
        id: Date.now() + 1,
        text: result.data.response || "Извинявам се, възникна грешка при обработката на вашето съобщение.",
        sender: "bot",
        timestamp: new Date(),
        properties: result.data.propertyResults?.results || [],
        propertyMetadata: result.data.propertyResults ? {
          propertyIds: result.data.propertyResults.results?.map(p => p.id) || [],
          propertyType: "search" as const,
          basicInfo: {
            totalResults: result.data.propertyResults.totalFound || result.data.propertyResults.results?.length || 0,
            isPropertySearch: result.data.isPropertySearch || false,
            searchCriteria: result.data.propertyResults.searchCriteria || {},
            processingTime: result.data.propertyResults.processingTime || 0
          }
        } : result.data.propertyInfoResult ? {
          propertyIds: result.data.propertyInfoResult.propertyData?.map(p => p.id) || [],
          propertyType: "info" as const,
          basicInfo: {
            totalResults: result.data.propertyInfoResult.propertiesFound || 0,
            isPropertyInfoRequest: result.data.propertyInfoResult.isPropertyInfoRequest || false,
            processingTime: result.data.propertyInfoResult.processingTime || 0
          }
        } : undefined
      };

      // Handle property info results
      if (result.data.propertyInfoResult && result.data.propertyInfoResult.propertyData) {
        botMessage.properties = result.data.propertyInfoResult.propertyData;
      }

      setMessages(prev => [...prev, botMessage]);
      setIsConnected(true);
        // Generate contextual quick replies based on API response
      const contextualQuickReplies = generateQuickReplies(botMessage, result.data);
      if (contextualQuickReplies.length > 0) {
        setQuickReplies(contextualQuickReplies);
        setShowQuickReplies(true);
      } else {
        setShowQuickReplies(false);
      }
      
      // Scroll to the bot message
      scrollToMessage(botMessage.id);
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorText = "Извинявам се, възникна техническа грешка. Моля, опитайте отново.";
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorText = "Не мога да се свържа с API сървъра. Моля, уверете се, че сървърът работи на http://localhost:8000";
      } else if (error instanceof Error) {
        if (error.message.includes('Failed to send message')) {
          errorText = "API сървърът върна грешка. Моля, проверете състоянието на сървъра.";
        } else if (error.message.includes('API request failed')) {
          errorText = "Възникна грешка при обработката на заявката. Моля, опитайте отново.";
        }
      }
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorText,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Scroll to the error message
      scrollToMessage(errorMessage.id);
    } finally {
      setIsTyping(false);
    }
  };
  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue;
    setInputValue("");
    
    // Hide quick replies when user types their own message
    setShowQuickReplies(false);

    // Check if this is the first user message and we don't have lead data
    const userMessages = messages.filter(m => m.sender === "user");
    if (userMessages.length === 0 && !leadData) {
      // Show lead capture form for first message
      setPendingMessage(message);
      setShowLeadCapture(true);
      return;
    }

    // Send message normally
    await sendMessageWithData(message, null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-luximo-600 to-luximo-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Estelio AI</h3>
                <p className="text-sm opacity-90">Виртуален агент за имоти</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            </div>
          </div>          {/* Quick Replies - moved to bottom */}
          {/* Quick Replies will be positioned at the bottom */}

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="h-80 p-4 overflow-y-auto scrollbar-hide"
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} data-message-id={message.id}>
                  <ChatMessage message={message} />
                </div>
              ))}

              {/* Lead Capture Form Inline */}
              {showLeadCapture && (
                <InlineLeadCapture
                  pendingMessage={pendingMessage}
                  onPendingMessageChange={setPendingMessage}
                  onSubmit={handleLeadCaptureSubmit}
                  onSkip={handleLeadCaptureSkip}
                />
              )}

              {/* Typing Indicator */}
              {isTyping && <TypingIndicator />}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Replies - positioned at bottom */}
          <QuickReplies 
            replies={quickReplies}
            onReplySelect={handleQuickReply}
            isVisible={!showLeadCapture && showQuickReplies}
          />

          {/* Input */}
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={sendMessage}
            onKeyPress={handleKeyPress}
            disabled={isTyping || showLeadCapture}
            placeholder={showLeadCapture ? "Моля, попълнете формата по-горе..." : "Напишете съобщение..."}
          />
        </div>
      </div>

      <style>{`
        .markdown-content p {
          margin-bottom: 0.5rem;
        }
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .markdown-content ul {
          list-style-type: disc;
        }        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Smooth scrolling for quick replies */
        .scrollbar-hide {
          scroll-behavior: smooth;
        }
        
        /* Ensure select dropdowns work properly */
        select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 8px center;
          background-size: 12px;
          padding-right: 24px !important;
        }
        
        select option {
          background-color: white;
          color: black;
          padding: 4px 8px;
        }
        
        select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 1px #6366f1;
        }
      `}</style>
    </>
  );
}
