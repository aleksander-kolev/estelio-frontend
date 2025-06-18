import { Message } from "./types";

export const generateQuickReplies = (lastMessage: Message, apiResponseData?: any): string[] => {
  if (lastMessage.sender !== "bot") return [];

  // Check if this is a property search response with properties
  if (lastMessage.properties && lastMessage.properties.length > 0) {
    if (lastMessage.propertyMetadata?.propertyType === "search") {
      return [
        "Покажи ми повече детайли",
        "Има ли нещо по-евтино?",
        "Търся в друг район",
        "Организирам оглед"
      ];
    } else if (lastMessage.propertyMetadata?.propertyType === "info") {
      return [
        "Организирам оглед на този имот",
        "Каква е точната цена?",
        "Има ли други подобни?",
        "Свържете ме с агента"
      ];
    }
  }
  // Check API response data for function type according to API.md
  if (apiResponseData) {
    // If API indicated property search but no properties returned
    if (apiResponseData.isPropertySearch && (!lastMessage.properties || lastMessage.properties.length === 0)) {
      return [
        "Търся с други критерии",
        "Увеличи бюджета",
        "Покажи в други градове",
        "Най-новите обяви"
      ];
    }
    
    // If this was a property info request (propertyInfoResult exists)
    if (apiResponseData.propertyInfoResult) {
      return [
        "Организирам оглед",
        "Други имоти от същия агент",
        "Подобни имоти в района",
        "Финансиране за този имот"
      ];
    }
    
    // If this was a successful property search (propertyResults exists)
    if (apiResponseData.propertyResults && apiResponseData.propertyResults.results && apiResponseData.propertyResults.results.length > 0) {
      return [
        "Покажи ми повече детайли",
        "Има ли нещо по-евтино?",
        "Търся в друг район",
        "Организирам оглед"
      ];
    }
    
    // Check for specific function calls if available in response
    if (apiResponseData.function_used === "getProperties" || apiResponseData.function === "getProperties") {
      return [
        "Покажи ми повече имоти",
        "Различни критерии",
        "Друг ценови диапазон",
        "Подобни имоти"
      ];
    }
    
    if (apiResponseData.function_used === "getPropertyInfo" || apiResponseData.function === "getPropertyInfo") {
      return [
        "Организирам оглед",
        "Контакт с агента",
        "Подобни имоти",
        "Финансиране"
      ];
    }
  }

  // Check message content for context clues
  const messageText = lastMessage.text.toLowerCase();
  
  // If message mentions specific locations
  if (messageText.includes('софия') || messageText.includes('sofia')) {
    return [
      "Покажи ми повече в София",
      "Търся в друг район на София",
      "Цени в София",
      "Транспорт в София"
    ];
  }
  
  if (messageText.includes('пловдив') || messageText.includes('plovdiv')) {
    return [
      "Повече имоти в Пловдив",
      "Други градове освен Пловдив",
      "Цени в Пловдив"
    ];
  }
  
  if (messageText.includes('варна') || messageText.includes('varna')) {
    return [
      "Имоти край морето",
      "Други морски градове",
      "Сезонни цени"
    ];
  }

  // If message mentions prices or budget
  if (messageText.includes('цена') || messageText.includes('price') || messageText.includes('бюджет') || messageText.includes('budget')) {
    return [
      "Покажи по-евтини варианти",
      "Покажи луксозни имоти",
      "Финансиране и кредити",
      "Скрити разходи"
    ];
  }

  // If message mentions investment or rental
  if (messageText.includes('инвестиция') || messageText.includes('investment') || messageText.includes('наем') || messageText.includes('rent')) {
    return [
      "Доходност от наеми",
      "Данъци при покупка",
      "Управление на имоти",
      "Пазарен анализ"
    ];
  }
  // For general questions about neighborhoods, market, etc.
  if (messageText.includes('квартал') || messageText.includes('район') || messageText.includes('neighborhood') || 
      messageText.includes('пазар') || messageText.includes('market') || messageText.includes('съвет') || messageText.includes('advice')) {
    return [
      "Търся конкретен имот",
      "Пазарни тенденции",
      "Най-добри квартали",
      "Съвети за покупка"
    ];
  }

  // For error messages or technical issues, don't show suggestions
  if (messageText.includes('грешка') || messageText.includes('error') || 
      messageText.includes('извинявам') || messageText.includes('съжалявам') ||
      messageText.includes('технически') || messageText.includes('сървър')) {
    return [];
  }

  // For greeting messages or general responses without specific context
  if (messageText.includes('здравей') || messageText.includes('благодаря') || 
      messageText.includes('добре') || messageText.includes('помощ') ||
      messageText.includes('как мога') || messageText.includes('помогна')) {
    return [
      "Търся апартамент в София",
      "Покажи ми къщи",
      "Имоти до 200,000 EUR",
      "Най-новите обяви"
    ];
  }

  // If no specific context found, hide suggestions (return empty array)
  return [];
};

// Generate initial suggestions for welcome message
export const getInitialQuickReplies = (): string[] => {
  return [
    "Търся апартамент в София",
    "Покажи ми къщи в Пловдив", 
    "Имоти до 200,000 EUR",
    "Най-новите обяви"
  ];
};
