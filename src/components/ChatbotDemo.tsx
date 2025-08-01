import { useState, useEffect, useRef } from "react";
import { Settings, X, ChevronLeft, ChevronRight } from "lucide-react";
import ChatMessage from "./chatbot/ChatMessage";
import QuickReplies from "./chatbot/QuickReplies";
import TypingIndicator from "./chatbot/TypingIndicator";
import ChatInput from "./chatbot/ChatInput";
import UserInfoModal from "./chatbot/UserInfoModal";
import SettingsPanel from "./chatbot/SettingsPanel";
import { Message, LeadCaptureData } from "./chatbot/types";
import { generateQuickReplies } from "./chatbot/utils";

export type { LeadCaptureData } from "./chatbot/types";

export default function ChatbotDemo() {  // Helper function to check if user data is complete
  const isUserDataComplete = (data: LeadCaptureData | null): boolean => {
    if (!data) return false;
    
    // Check if all required fields have non-empty values
    const hasName = data.name && data.name.trim().length > 0;
    const hasEmail = data.email && data.email.trim().length > 0;
    const hasTransactionType = data.transactionType && data.transactionType.trim().length > 0;
    const hasBudget = data.budget && data.budget.trim().length > 0;
    const hasPropertyPreferences = data.propertyPreferences && data.propertyPreferences.trim().length > 0;
    
    return hasName && hasEmail && hasTransactionType && hasBudget && hasPropertyPreferences;
  };

  // Initial welcome message from bot
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "**Добре дошли в Estelio!** 🏠\n\nАз съм вашият персонален асистент за недвижими имоти. Мога да ви помогна да:\n\n• Търсите имоти по ваши критерии  \n• Получите детайлна информация за конкретни имоти  \n• Свържа ви с агенти  \n\nИзберете едно от предложенията по-долу или опишете какво търсите:",
      sender: "bot",
      timestamp: new Date(),
      propertyMetadata: {
        propertyIds: [],
        propertyType: "search" as const,
        basicInfo: {}
      }
    }
  ]);
    const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [currentView, setCurrentView] = useState<"chat" | "register" | "settings">("chat");
  const [pendingMessage, setPendingMessage] = useState("");
  const [leadData, setLeadData] = useState<LeadCaptureData | null>(null);  const [quickReplies, setQuickReplies] = useState<string[]>([
    "Търся апартамент в София",
    "Покажи ми къщи в Пловдив", 
    "Имоти до 200,000 EUR",
    "Най-новите обяви"
  ]); // Initial suggestions
  const [showQuickReplies, setShowQuickReplies] = useState(true);  const [galleryData, setGalleryData] = useState<{property: any, imageIndex: number} | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Gallery handlers
  const handleOpenGallery = (property: any, imageIndex: number) => {
    setGalleryData({property, imageIndex});
    setCurrentImageIndex(imageIndex);
  };

  const handleCloseGallery = () => {
    setGalleryData(null);
  };

  const handleNextImage = () => {
    if (galleryData && galleryData.property.media?.imageUrls) {
      setCurrentImageIndex(prev => 
        prev === galleryData.property.media.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };
  const handlePrevImage = () => {
    if (galleryData && galleryData.property.media?.imageUrls) {
      setCurrentImageIndex(prev => 
        prev === 0 ? galleryData.property.media.imageUrls.length - 1 : prev - 1
      );
    }
  };

  // Gallery keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!galleryData) return;
      
      switch (e.key) {
        case 'Escape':
          handleCloseGallery();
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
      }
    };

    if (galleryData) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [galleryData]);
  // Function to handle quick reply selection
  const handleQuickReply = (reply: string) => {
    // Hide quick replies when user selects one
    setShowQuickReplies(false);
    
    // Check if this is the first user message and we don't have complete lead data
    const userMessages = messages.filter(m => m.sender === "user");
    if (userMessages.length === 0 && !isUserDataComplete(leadData)) {
      // Show user info modal for first message
      setPendingMessage(reply);
      setShowUserInfoModal(true);
      return;
    }

    // For subsequent messages, check if user data is complete
    if (!isUserDataComplete(leadData)) {
      // Prevent sending message and show a prompt
      setShowUserInfoModal(true);
      setPendingMessage(reply);
      return;
    }

    // Send message directly without setting input value
    sendMessageWithData(reply, leadData);
  };
  // Scroll functions
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };  const scrollToMessage = (messageId: number) => {
    const element = document.querySelector(`[data-message-id="${messageId}"]`);
    if (element && chatContainerRef.current) {
      // Calculate the element's position relative to the chat container to scroll to the top of the message
      const container = chatContainerRef.current;
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Calculate scroll position to place the message at the top of the visible area
      const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - 10; // 10px offset from top
      
      container.scrollTo({
        top: Math.max(0, scrollTop), // Ensure we don't scroll past the top
        behavior: "smooth"
      });
    }
  };
  useEffect(() => {
    // Only auto-scroll if there's more than just the initial welcome message
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [isTyping]);  // Lead capture form handlers
  const handleLeadCaptureSubmit = (data: LeadCaptureData) => {
    console.log('🔍 Form submitted with data:', {
      name: `"${data.name}"`,
      email: `"${data.email}"`,
      phone: `"${data.phone}"`,
      transactionType: `"${data.transactionType}"`,
      budget: `"${data.budget}"`,
      propertyPreferences: `"${data.propertyPreferences}"`,
      isValid: isUserDataComplete(data)
    });
    
    setLeadData(data);
    setShowUserInfoModal(false);
    
    // Send the pending message with lead data
    if (pendingMessage) {
      sendMessageWithData(pendingMessage, data);
      setPendingMessage("");
    }
  };const handleLeadCaptureSkip = () => {
    setShowUserInfoModal(false);
    
    // If there's a pending message, send it without lead data
    if (pendingMessage) {
      sendMessageWithData(pendingMessage, null);
      setPendingMessage("");
    }

    // Clear input value to prevent it from being sent later
    setInputValue("");
  };  const handleLeadCaptureClose = () => {
    setShowUserInfoModal(false);
    
    // Clear the pending message without sending it (user cancelled)
    setPendingMessage("");
    
    // Keep input field empty since the message was cancelled
    setInputValue("");
  };const handleSettingsSave = (data: LeadCaptureData) => {
    const previousData = leadData;
    setLeadData(data);
    setShowSettingsPanel(false);
    
    // Only send update message if data has actually changed and this is not the initial setup
    const hasChanged = !previousData || 
      previousData.name !== data.name ||
      previousData.email !== data.email ||
      previousData.phone !== data.phone ||
      previousData.transactionType !== data.transactionType ||
      previousData.budget !== data.budget ||
      previousData.propertyPreferences !== data.propertyPreferences;
    
    if (hasChanged && previousData) { // Only send if not first time and something changed
      const updateMessage = "Моите предпочитания са актуализирани. Моля, вземете ги предвид за бъдещи препоръки.";
      sendMessageWithData(updateMessage, data);
    }
  };  const sendMessageWithData = async (message: string, userData: LeadCaptureData | null) => {
    if (!message.trim()) return;

    // Always include user data if available (either from parameter or stored leadData)
    const userDataToSend = userData || leadData;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Build request body according to API.md specification
      const requestBody: any = {
        message: message
      };

      // Add user profile if available
      if (userDataToSend) {
        requestBody.userProfile = {
          name: userDataToSend.name,
          email: userDataToSend.email,
          phone: userDataToSend.phone || undefined,
          preferences: {
            transactionType: userDataToSend.transactionType,
            budget: userDataToSend.budget,
            propertyPreferences: userDataToSend.propertyPreferences
          }
        };
      }

      // Add conversation history (last 5 messages for context)
      if (messages.length > 0) {
        requestBody.conversationHistory = messages.slice(-5).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
          propertyMetadata: msg.propertyMetadata
        }));
      }      console.log('🌐 Making API request to /api/chat-simple with:', requestBody);

      // Make request to the real API endpoint according to API.md
      const response = await fetch('https://chat.estelio.homes/api/chat-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('🌐 Raw response status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to send message`);
      }

      const result = await response.json();
      console.log('🌐 API Response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'API request failed');
      }
        // Extract properties according to real API response structure
      let properties: any[] = [];
      let propertyMetadata: any = undefined;      // Function to transform API property to PropertyCard format
      const transformApiProperty = (apiProperty: any) => {
        const transformed = {
          id: apiProperty.id || apiProperty.referenceNumber || 'unknown',
          title: apiProperty.title || 'Property Title',
          price: apiProperty.price?.amount || 0,
          currency: apiProperty.price?.currency || 'EUR',
          priceInEUR: apiProperty.price?.currency === 'EUR' ? apiProperty.price?.amount : apiProperty.price?.amount || 0,
          location: {
            city: apiProperty.location?.town || apiProperty.location?.city || 'Unknown',
            area: apiProperty.location?.district || apiProperty.location?.area || '',
            address: apiProperty.location?.complexName || '',
            mapLink: apiProperty.location?.mapLink || ''
          },
          type: apiProperty.propertyType?.[0]?.includes('apartment') ? 'apartment' as const : 
                apiProperty.propertyType?.[0]?.includes('house') ? 'house' as const : 
                'apartment' as const,
          features: {
            bedrooms: apiProperty.specifications?.bedrooms || 0,
            bathrooms: apiProperty.specifications?.bathrooms || 0,
            area: apiProperty.area?.total || 0,
            floor: apiProperty.specifications?.floor || 0,
            parking: apiProperty.specifications?.coveredParkingSpace || false,
            garden: false // Not in API response
          },
          description: apiProperty.description?.replace(/<[^>]*>/g, '') || 'No description available',
          media: {
            imageUrls: apiProperty.media?.imageUrls || [],
            infoPackUrl: apiProperty.media?.infoPackUrl || ''
          },
          contact: {
            phone: apiProperty.agent?.mobilePhone || '',
            email: apiProperty.agent?.email || '',
            agent: apiProperty.agent?.name || 'Contact Agent'
          }
        };
        
        console.log('🔄 Transforming property:', {
          original: {
            id: apiProperty.id,
            title: apiProperty.title,
            price: apiProperty.price?.amount,
            location: apiProperty.location?.town
          },
          transformed: {
            id: transformed.id,
            title: transformed.title,
            price: transformed.price,
            location: transformed.location.city
          }
        });
        
        return transformed;
      };// Handle property search results (Real API: data.propertyResults.matchingProperties)
      if (result.data.propertyResults?.matchingProperties && Array.isArray(result.data.propertyResults.matchingProperties)) {
        // Transform the API properties to match PropertyCard interface
        properties = result.data.propertyResults.matchingProperties.map(transformApiProperty);
        propertyMetadata = {
          propertyIds: result.data.propertyResults.matchingProperties.map((p: any) => p.id || p.referenceNumber || 'unknown'),
          propertyType: "search" as const,
          basicInfo: {
            totalResults: result.data.propertyResults.totalMatches || result.data.propertyResults.matchingProperties.length,
            isPropertySearch: true,
            searchCriteria: result.data.propertyResults.searchStats || {},
            processingTime: result.data.propertyResults.searchStats?.processingTime || 0
          }
        };
        console.log('🔍 Extracted and Transformed Property Search Results:', properties.length, 'properties');
        console.log('🔍 Sample transformed property:', properties[0]);
      }
      
      // Also check for the API.md format (fallback for different API versions)
      else if (result.data.propertyResults?.results && Array.isArray(result.data.propertyResults.results)) {
        properties = result.data.propertyResults.results;
        propertyMetadata = {
          propertyIds: result.data.propertyResults.results.map((p: any) => p.id || p.ID || 'unknown'),
          propertyType: "search" as const,
          basicInfo: {
            totalResults: result.data.propertyResults.totalFound || result.data.propertyResults.results.length,
            isPropertySearch: result.data.isPropertySearch || false,
            searchCriteria: result.data.propertyResults.searchCriteria || {},
            processingTime: result.data.propertyResults.processingTime || 0
          }
        };
        console.log('🔍 Extracted Property Search Results (API.md format):', properties.length, 'properties');
      }
      
      // Handle property info results (API.md: data.propertyInfoResult.propertyData)
      if (result.data.propertyInfoResult?.propertyData && Array.isArray(result.data.propertyInfoResult.propertyData)) {
        properties = result.data.propertyInfoResult.propertyData;
        propertyMetadata = {
          propertyIds: result.data.propertyInfoResult.propertyData.map((p: any) => p.id || p.ID || 'unknown'),
          propertyType: "info" as const,
          basicInfo: {
            totalResults: result.data.propertyInfoResult.propertiesFound || 0,
            isPropertyInfoRequest: result.data.propertyInfoResult.isPropertyInfoRequest || false,
            processingTime: result.data.propertyInfoResult.processingTime || 0
          }
        };
        console.log('🔍 Extracted Property Info Results:', properties.length, 'properties');
      }

      // For general conversation, no properties are included
      if (properties.length === 0) {
        console.log('💬 General conversation response (no properties)');
      }

      // Create bot response message with extracted data
      const botMessage: Message = {
        id: Date.now() + 1,
        text: result.data.response || "Извинявам се, възникна техническа грешка. Моля, опитайте отново.",
        sender: "bot",
        timestamp: new Date(),
        properties: properties.length > 0 ? properties : undefined,
        propertyMetadata: propertyMetadata
      };

      console.log('🤖 Bot Message Created:', {
        id: botMessage.id,
        textPreview: botMessage.text.substring(0, 50) + '...',
        propertiesCount: botMessage.properties?.length || 0,
        hasProperties: !!botMessage.properties,
        propertyType: propertyMetadata?.propertyType
      });

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
      scrollToMessage(botMessage.id);    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      let errorText = "Извинявам се, възникна техническа грешка. Моля, опитайте отново.";
      let shouldUseFallback = false;
      
      // Provide more specific error messages and fallback logic
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorText = "🔄 Използвам тестови данни, тъй като API сървърът не отговаря.";
        shouldUseFallback = true;
      } else if (error instanceof Error) {
        if (error.message.includes('Failed to send message') || error.message.includes('HTTP 500')) {
          errorText = "🔄 API сървърът има проблем. Използвам тестови данни.";
          shouldUseFallback = true;
        } else if (error.message.includes('API request failed')) {
          errorText = "🔄 Използвам тестови данни поради API грешка.";
          shouldUseFallback = true;
        }
      }
        // If we should use fallback, create a mock response for testing
      if (shouldUseFallback && (message.toLowerCase().includes('апартамент') || message.toLowerCase().includes('къща') || message.toLowerCase().includes('имот'))) {
        console.log('🧪 Using fallback mock data for property search testing...');
          const mockProperties = [
          {
            id: "prop_fallback_001",
            title: "🧪 Тестов апартамент в център на София",
            price: 145000,
            currency: "EUR" as const,
            priceInEUR: 145000,
            location: {
              city: "София",
              area: "Център",
              address: "ул. Витоша 123"
            },
            type: "apartment" as const,
            features: {
              bedrooms: 2,
              bathrooms: 1,
              area: 75,
              floor: 3,
              parking: true,
              garden: false
            },
            description: "Тестов имот за демонстрация на функционалността",
            contact: {
              phone: "+359 888 123 456",
              agent: "Тестов агент"
            }
          }
        ];
        
        const botMessage: Message = {
          id: Date.now() + 1,
          text: `${errorText}\n\nНамерих 1 тестов имот за демонстрация:`,
          sender: "bot",
          timestamp: new Date(),
          properties: mockProperties,
          propertyMetadata: {
            propertyIds: ["prop_fallback_001"],
            propertyType: "search" as const,
            basicInfo: {
              totalResults: 1,
              isPropertySearch: true,
              isFallback: true
            }
          }
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsConnected(false); // Indicate we're not connected to real API
      } else {
        // Add regular error message for non-property searches or when fallback is not appropriate
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: errorText,
          sender: "bot",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsConnected(false);
      }
        // Scroll to bottom of chat
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } finally {
      setIsTyping(false);
    }
  };  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue;
    setInputValue("");
    
    // Hide quick replies when user types their own message
    setShowQuickReplies(false);

    console.log('📤 sendMessage called with:', {
      message: message,
      leadData: leadData,
      isComplete: isUserDataComplete(leadData),
      userMessagesCount: messages.filter(m => m.sender === "user").length
    });

    // Check if this is the first user message and we don't have complete lead data
    const userMessages = messages.filter(m => m.sender === "user");
    if (userMessages.length === 0 && !isUserDataComplete(leadData)) {
      // Show user info modal for first message
      console.log('📝 First message, showing modal');
      setPendingMessage(message);
      setShowUserInfoModal(true);
      return;
    }

    // For subsequent messages, check if user data is complete
    if (!isUserDataComplete(leadData)) {
      // Prevent sending message and show a prompt
      console.log('📝 Subsequent message, user data incomplete, showing modal');
      setShowUserInfoModal(true);
      setPendingMessage(message);
      return;
    }

    // Send message normally (always include leadData if available)
    console.log('✅ Sending message normally');
    await sendMessageWithData(message, leadData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Register Form Component
  const RegisterForm = () => (
    <div className="p-6 space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Регистрация</h3>
        <p className="text-gray-600 text-sm">Създайте профил за пълен достъп до функционалностите</p>
      </div>
      
      <form autoComplete="on" className="space-y-4">
        <div className="space-y-3">
          <input
            type="text"
            name="firstName"
            placeholder="Име"
            autoComplete="given-name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Фамилия"
            autoComplete="family-name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email адрес"
            autoComplete="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            autoComplete="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Парола"
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Потвърдете паролата"
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setCurrentView("chat")}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Назад
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-luximo-600 text-white rounded-lg hover:bg-luximo-700 transition-colors text-sm font-medium"
          >
            Регистрация
          </button>
        </div>
      </form>
      
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          Вече имате профил?{" "}
          <button className="text-luximo-600 hover:text-luximo-700 font-medium">
            Влезте тук
          </button>
        </p>
      </div>
    </div>
  );

  // Settings Form Component  
  const SettingsForm = () => (
    <div className="p-6 space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Настройки на профила</h3>
        <p className="text-gray-600 text-sm">Управлявайте вашите предпочитания и данни</p>
      </div>
      
      <form autoComplete="on" className="space-y-4">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Лични данни</label>
          <input
            type="text"
            name="fullName"
            placeholder="Пълно име"
            autoComplete="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email адрес"
            autoComplete="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            autoComplete="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Предпочитания за търсене</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm">
            <option value="">Тип сделка</option>
            <option value="buy">Покупка</option>
            <option value="rent">Наем</option>
          </select>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm">
            <option value="">Предпочитан регион</option>
            <option value="sofia">София</option>
            <option value="plovdiv">Пловдив</option>
            <option value="varna">Варна</option>
            <option value="burgas">Бургас</option>
          </select>
          <input
            type="text"
            placeholder="Ценови диапазон"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Известия</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-luximo-600 focus:ring-luximo-500" />
              <span className="ml-2 text-sm text-gray-700">Email известия за нови имоти</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-luximo-600 focus:ring-luximo-500" />
              <span className="ml-2 text-sm text-gray-700">SMS известия</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-luximo-600 focus:ring-luximo-500" />
              <span className="ml-2 text-sm text-gray-700">Седмичен бюлетин</span>
            </label>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => setCurrentView("chat")}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Назад
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-luximo-600 text-white rounded-lg hover:bg-luximo-700 transition-colors text-sm font-medium"
          >
            Запази промените
          </button>
        </div>
      </form>
    </div>
  );

  return (    <>
      <div className="w-full max-w-md mx-auto relative">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative">{/* Header */}
          <div className="bg-gradient-to-r from-luximo-600 to-luximo-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Estelio AI</h3>
                <p className="text-sm opacity-90">Виртуален агент за имоти</p>
              </div>
              <div className="flex items-center gap-2">
                {currentView === "chat" && (
                  <>
                    <button
                      onClick={() => setCurrentView("register")}
                      className="px-3 py-1 text-xs bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Регистрация
                    </button>
                    <button
                      onClick={() => setCurrentView("settings")}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      title="Настройки"
                    >
                      <Settings size={18} />
                    </button>
                  </>
                )}
                {currentView !== "chat" && (
                  <button
                    onClick={() => setCurrentView("chat")}
                    className="px-3 py-1 text-xs bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Чат
                  </button>
                )}
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              </div>
            </div>          </div>
          
          {/* Content Area */}
          {currentView === "chat" && (
            <>
              {/* Chat Messages */}              <div 
                ref={chatContainerRef}
                data-chat-container
                className="h-80 p-4 overflow-y-auto scrollbar-hide chat-container"
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} data-message-id={message.id} className="chat-message">
                      <ChatMessage message={message} onOpenGallery={handleOpenGallery} />
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && <TypingIndicator />}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick Replies - positioned at bottom */}
              <QuickReplies 
                replies={quickReplies}
                onReplySelect={handleQuickReply}
                isVisible={!showUserInfoModal && showQuickReplies}
              />              {/* Input or Data Completion Prompt */}
              {!isUserDataComplete(leadData) && pendingMessage ? (
                // Show prompt to complete user data when there's a pending message
                <div className="p-4 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-luximo-50 to-blue-50 border border-luximo-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-luximo-400 rounded-full mt-2 animate-pulse"></div>
                      <div>
                        <p className="text-sm font-medium text-luximo-800 mb-1">
                          🏠 Подобрете вашето преживяване
                        </p>
                        <p className="text-xs text-luximo-600">
                          Попълнете профила си за персонализирани препоръки и по-точни резултати при търсене.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUserInfoModal(true)}
                      className="bg-luximo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-luximo-700 transition-all transform hover:scale-105 shadow-md"
                    >
                      Завърши профила
                    </button>
                  </div>
                </div>
              ) : (
                // Show normal chat input
                <ChatInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={sendMessage}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping || showUserInfoModal}
                  placeholder={showUserInfoModal ? "Моля, попълнете формата..." : "Напишете съобщение..."}
                />
              )}
            </>
          )}

          {currentView === "register" && (
            <div className="h-80 overflow-y-auto">
              <RegisterForm />
            </div>
          )}

          {currentView === "settings" && (
            <div className="h-80 overflow-y-auto">
              <SettingsForm />
            </div>          )}
        </div>

        {/* Photo Gallery Modal - positioned over entire chat */}
        {galleryData && galleryData.property.media?.imageUrls && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center overflow-hidden rounded-2xl"
            onClick={handleCloseGallery}
          >
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleCloseGallery}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition-all"
              >
                <X size={24} />
              </button>
              
              <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-70 text-white px-4 py-2 rounded text-lg">
                {currentImageIndex + 1} / {galleryData.property.media.imageUrls.length}
              </div>
              
              {galleryData.property.media.imageUrls.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-70 text-white p-4 rounded-full hover:bg-opacity-90 transition-all"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-70 text-white p-4 rounded-full hover:bg-opacity-90 transition-all"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
              
              <img
                src={galleryData.property.media.imageUrls[currentImageIndex]}
                alt={`Property ${currentImageIndex + 1}`}
                className="max-w-[90%] max-h-[90%] object-contain"
              />
            </div>
          </div>
        )}        {/* User Info Modal - positioned over chat */}
        {showUserInfoModal && (
          <UserInfoModal
            isOpen={showUserInfoModal}
            onClose={handleLeadCaptureClose}
            onSkip={handleLeadCaptureSkip}
            onSubmit={handleLeadCaptureSubmit}
            pendingMessage={pendingMessage}
            initialData={leadData || undefined}
          />
        )}

        {/* Settings Panel - positioned over chat */}
        {showSettingsPanel && (
          <SettingsPanel
            isOpen={showSettingsPanel}
            onClose={() => setShowSettingsPanel(false)}
            userData={leadData}
            onSave={handleSettingsSave}
          />
        )}
      </div>

      {/* Register Form - Conditional Rendering */}
      {currentView === "register" && <RegisterForm />}

      {/* Settings Form - Conditional Rendering */}
      {currentView === "settings" && <SettingsForm />}

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
        }        .markdown-content ul {
          list-style-type: disc;
        }        /* Table styles for spreadsheet formatting */
        .markdown-content {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        
        /* Table container with top and bottom scrollbars */
        .table-scroll-container {
          margin: 0.5rem 0;
          max-width: 100%;
        }
        
        .table-scroll-top {
          height: 8px;
          background: #f1f1f1;
          border-radius: 4px;
          margin-bottom: 4px;
          overflow-x: auto;
          overflow-y: hidden;
        }
        
        .table-wrapper {
          overflow-x: auto;
          max-width: 100%;
          border-radius: 4px;
        }
        
        .markdown-content table {
          border-collapse: collapse;
          width: auto;
          min-width: 100%;
          font-size: 0.875rem;
          table-layout: auto;
          margin: 0;
        }
        
        .markdown-content th,
        .markdown-content td {
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          text-align: left;
          white-space: nowrap;
          min-width: 120px;
          vertical-align: top;
        }
        
        .markdown-content th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        
        .markdown-content tbody tr:nth-child(even) {
          background-color: #f9fafb;
        }
        
        .markdown-content tbody tr:hover {
          background-color: #f3f4f6;
        }
        
        /* Scrollbar styling for table wrapper */
        .table-wrapper::-webkit-scrollbar {
          height: 8px;
        }
        
        .table-wrapper::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .table-wrapper::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .table-wrapper::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Sync scrolling between top indicator and table wrapper */
        .table-scroll-top::-webkit-scrollbar {
          height: 8px;
        }
        
        .table-scroll-top::-webkit-scrollbar-track {
          background: #e5e5e5;
          border-radius: 4px;
        }
        
        .table-scroll-top::-webkit-scrollbar-thumb {
          background: #999;
          border-radius: 4px;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .markdown-content table {
            font-size: 0.75rem;
          }
          .markdown-content th,
          .markdown-content td {
            padding: 0.375rem 0.5rem;
            min-width: 100px;
          }
        }.scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Prevent any unwanted animations or wiggling */
        .scrollbar-hide {
          scroll-behavior: smooth;
        }
        
        /* Stabilize chat container */
        .chat-container {
          will-change: auto;
          transform: translateZ(0);
        }
        
        /* Prevent layout shifts */
        .chat-message {
          contain: layout;
        }
          /* Ensure select dropdowns work properly */
        select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 8px center;
          background-size: 12px;
          padding-right: 24px !important;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        
        select option {
          background-color: white;
          color: black;
          padding: 4px 8px;
        }
        
        select:focus {
          outline: none;
          border-color: #8b5cf6 !important;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2) !important;
        }
      `}</style>
    </>
  );
}
