import { Bot } from "lucide-react";
import { useState, useEffect } from "react";

export default function TypingIndicator() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const thinkingMessages = [
    "Мисля...",
    "Анализирам базата данни...", 
    "Търся най-добрите варианти...",
    "Проверявам цените...",
    "Сравнявам локациите...",
    "Почти готово...",
    "Подготвям отговора...",
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % thinkingMessages.length);
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 15 + 5; // Variable progress speed
      });
    }, 300);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);  return (
    <div className="flex justify-start" style={{ height: '72px' }}> {/* Fixed height */}
      <div className="flex items-start gap-2 max-w-[85%]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-luximo-100 to-luximo-200 text-luximo-600 flex items-center justify-center flex-shrink-0">
          <Bot size={16} />
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 shadow-sm flex flex-col justify-center" style={{ height: '56px', width: '280px' }}>
          <div className="flex items-center space-x-2" style={{ height: '24px' }}>
            <span className="text-sm text-gray-700 font-medium min-w-0 truncate">
              {thinkingMessages[currentMessage]}
            </span>
            <div className="flex space-x-1 flex-shrink-0">
              <div className="w-1.5 h-1.5 bg-luximo-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-luximo-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-1.5 h-1.5 bg-luximo-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-luximo-400 to-luximo-600 h-1.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
