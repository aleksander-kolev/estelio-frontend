
import { useState, useEffect } from "react";
import { User, Bot } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  delay: number;
}

const ChatbotDemo = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typingIndicator, setTypingIndicator] = useState(false);

  const demoConversation: Message[] = [
    {
      id: 1,
      text: "Здравейте! Как мога да ви помогна?",
      sender: "bot",
      delay: 500,
    },
    {
      id: 2,
      text: "Намери ми апартамент под наем до 1500 лв, луксозен, около центъра, в комплекс със сауна.",
      sender: "user",
      delay: 2000,
    },
    {
      id: 3,
      text: "Търся за вас луксозни апартаменти под наем до 1500 лв в централната част на града с достъп до сауна. Ето какво намерих:",
      sender: "bot",
      delay: 3000,
    },
    {
      id: 4,
      text: "Имам 3 предложения, които отговарят на всички ваши критерии. Например, двустаен апартамент на ул. Граф Игнатиев, 65 кв.м, напълно обзаведен, с достъп до сауна и фитнес, на цена 1450 лв/месец.",
      sender: "bot",
      delay: 500,
    },
    {
      id: 5,
      text: "Искате ли да видите повече детайли за този имот?",
      sender: "bot",
      delay: 500,
    },
  ];

  useEffect(() => {
    if (currentIndex < demoConversation.length) {
      const currentMessage = demoConversation[currentIndex];

      if (currentMessage.sender === "bot") {
        setTypingIndicator(true);
      }

      const timer = setTimeout(() => {
        setTypingIndicator(false);
        setMessages((prevMessages) => [...prevMessages, currentMessage]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, currentMessage.delay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, demoConversation]);

  useEffect(() => {
    // Reset animation after completing
    if (currentIndex === demoConversation.length) {
      const resetTimer = setTimeout(() => {
        setMessages([]);
        setCurrentIndex(0);
      }, 10000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentIndex, demoConversation.length]);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-sm mx-auto md:mx-0 border border-gray-200">
      {/* Chat Header */}
      <div className="bg-luximo-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-medium">Estelio Асистент</span>
        </div>
        <div className="h-2 w-2 rounded-full bg-green-400"></div>
      </div>

      {/* Chat Body */}
      <div className="p-4 h-96 flex flex-col overflow-y-auto bg-gray-50">
        <div className="flex-grow flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-luximo-600 text-white rounded-tr-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === "bot" && (
                    <Bot size={18} className="mt-1 flex-shrink-0" />
                  )}
                  <p className="text-sm">{message.text}</p>
                  {message.sender === "user" && (
                    <User size={18} className="mt-1 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {typingIndicator && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-3 rounded-tl-none max-w-[80%]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Напишете вашето запитване..."
            className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-luximo-500"
            disabled
          />
          <button
            className="bg-luximo-600 text-white p-2 rounded-md hover:bg-luximo-700"
            disabled
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotDemo;
