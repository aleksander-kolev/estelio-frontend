import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PropertyList from "../PropertyList";
import { Message } from "./types";

interface ChatMessageProps {
  message: Message;
  onOpenGallery?: (property: any, imageIndex: number) => void;
}

export default function ChatMessage({ message, onOpenGallery }: ChatMessageProps) {
  // Debug logging for all messages
  console.log('ChatMessage called with:', {
    id: message.id,
    sender: message.sender,
    text: message.text.substring(0, 50) + '...',
    hasProperties: !!message.properties,
    propertiesArray: Array.isArray(message.properties),
    propertiesCount: message.properties?.length || 0,
    properties: message.properties,
    metadata: message.propertyMetadata
  });

  // Enhanced debugging for bot messages
  if (message.sender === 'bot') {
    console.log('🤖 Bot Message Details:', {
      text: message.text.substring(0, 100) + '...',
      propertiesCount: message.properties?.length || 0,
      hasProperties: !!message.properties,
      propertiesArray: Array.isArray(message.properties),
      properties: message.properties,
      metadata: message.propertyMetadata,
      willShowPropertyList: !!(message.properties && Array.isArray(message.properties) && message.properties.length > 0)
    });
    
    if (message.properties && message.properties.length > 0) {
      console.log('🏠 Properties to display:', message.properties);
    } else {
      console.log('❌ No properties to display');
    }
  }
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`flex items-start gap-2 max-w-[85%] min-w-0 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.sender === 'user' 
            ? 'bg-luximo-600 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
        </div>
        
        {/* Message Content */}
        <div className={`rounded-lg p-3 min-w-0 flex-1 ${
          message.sender === 'user'
            ? 'bg-luximo-600 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}>          <div className="markdown-content break-words">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children, ...props }) => (
                  <div className="table-scroll-container">
                    <div className="table-scroll-top"></div>
                    <div className="table-wrapper">
                      <table {...props}>{children}</table>
                    </div>
                  </div>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
            {/* Properties */}
          {message.properties && Array.isArray(message.properties) && message.properties.length > 0 && (
            <div className="mt-3 w-full overflow-hidden">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">
                Намерени имоти ({message.properties.length}):
              </h4>              <PropertyList 
                properties={message.properties}
                isPropertyInfo={message.propertyMetadata?.propertyType === "info"}
                onOpenGallery={onOpenGallery}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
