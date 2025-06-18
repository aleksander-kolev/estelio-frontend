# Property AI Server - API Documentation

This document provides comprehensive API documentation for the Property AI Search Server featuring intelligent auto-detection of property searches, enhanced conversation capabilities with property metadata integration, and personalized user profiles.

**📋 Quick Reference:** For just the request/response structures, see [API_REFERENCE.md](./API_REFERENCE.md)

## Base URL
```
http://localhost:8000
```

## Authentication
Currently no authentication is required. For production use, implement API keys or OAuth.

## Headers
All requests should include:
```
Content-Type: application/json
```

## Error Responses
All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Internal Server Error

---

## Endpoints

### 1. Health Check

Check if the server is running and healthy.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-03T17:01:36.273Z",
  "version": "1.0.0"
}
```

**Example:**
```bash
curl -X GET http://localhost:8000/health
```

---

### 2. Streaming Chat

Real-time AI-powered conversation with intelligent auto-detection for property searches and general conversations.

**Endpoint:** `POST /api/chat`

**Request Body:**
```typescript
interface StreamingChatRequest {
  message: string;                    // Required: User's query (property search or general conversation)
  userProfile?: UserProfile;          // Optional: User profile for personalized responses
  conversationHistory?: ConversationMessage[]; // Optional: Enhanced conversation context
}

interface UserProfile {
  name?: string;                      // User's name (AI will address user by name)
  email?: string;                     // User's email
  phone?: string;                     // User's phone number
  preferences?: {                     // Property preferences (used as fallback/context)
    propertyType?: string;            // Preferred property type (apartment, house, villa, etc.)
    budget?: string;                  // Budget range or amount  
    transactionType?: "buy" | "rent" | "both"; // Preferred transaction type
    additionalSpecifications?: string; // Additional requirements (elevator, parking, amenities, etc.)
    location?: string;                // Preferred locations (cities, districts, neighborhoods)
  };
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  propertyMetadata?: PropertyMetadata; // Optional: Property-specific context
}

interface PropertyMetadata {
  propertyIds?: string[];             // Array of property IDs discussed
  propertyType?: "search" | "info";   // Type of property interaction
  basicInfo?: Record<string, {        // Basic property information for context
    title?: string;
    price?: number;
    location?: string;
    type?: string;
  }>;
  searchCriteria?: Record<string, unknown>; // Original search criteria
  propertyDetails?: Record<string, unknown>; // Additional property details
}
```

**UserProfile Usage Rules:**
- **Personalization**: `userProfile.name` enables personalized AI responses (e.g., "Hi John, I found...")
- **Fallback Context**: `userProfile.preferences` provides default search context when not specified in chat
- **Override Priority**: Explicit chat input ALWAYS overrides userProfile preferences
- **Optional Fields**: All userProfile fields are optional and enhance rather than replace chat interaction

**Response:** Server-Sent Events stream

**AI Auto-Detection:**
The system automatically detects whether your message is:
- **Property Search Query**: Triggers property search and returns relevant listings
- **Property Info Request**: Retrieves detailed information about specific properties (supports contextual references)
- **Property Comparison**: Uses conversation history metadata to compare previously discussed properties
- **General Conversation**: Provides real estate guidance or general information

**Stream Event Types:**
- `content` - AI response chunks for general conversation
- `properties` - Complete property search results
- `property_info` - Detailed information about specific properties
- `complete` - Stream completion event

**Response Format:**
```
# For general conversations:
data: {"type": "content", "content": "I'd be happy to help you with..."}
data: {"type": "content", "content": " your property search. Sofia has several..."}
data: {"type": "complete"}

# For property searches:
data: {"type": "properties", "count": 15, "results": [...], "response": "Here are 15 properties matching your criteria..."}
data: {"type": "complete"}
```

**Example Request:**
```javascript
const response = await fetch('http://localhost:8000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'I need a 2-bedroom apartment in Sofia under 150,000 EUR',    userProfile: {
      name: 'John',
      email: 'john@example.com',
      phone: '+359 888 123 456',
      preferences: {
        propertyType: 'apartment',
        transactionType: 'buy',
        location: 'Sofia',
        budget: '100k-200k EUR'
      }
    },
    conversationHistory: [
      {
        role: 'user',
        content: 'What areas in Sofia do you recommend?'
      },
      {
        role: 'assistant',
        content: 'Hi John! Sofia has several great neighborhoods for apartments...'
      },
      {
        role: 'user',
        content: 'Show me apartments in Lozenets'
      },
      {
        role: 'assistant',
        content: 'I found 15 apartments in Lozenets matching your criteria.',
        propertyMetadata: {
          propertyIds: ['prop_01', 'prop_02', 'prop_03'],
          propertyType: 'search',
          basicInfo: {
            'prop_01': { title: 'Modern Apartment', price: 145000, location: 'Lozenets', type: 'apartment' },
            'prop_02': { title: 'Spacious 2BR', price: 130000, location: 'Lozenets', type: 'apartment' },
            'prop_03': { title: 'City View Flat', price: 140000, location: 'Lozenets', type: 'apartment' }
          },
          searchCriteria: { location: 'Lozenets', bedrooms: 2, maxPrice: 150000 }
        }
      }
    ]
  })
});

// Handle streaming response
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      
      switch (data.type) {
        case 'content':
          // For general conversations - streaming content
          console.log('AI says:', data.content);
          break;
          
        case 'properties':
          // For property searches - complete results
          console.log(`Found ${data.count} properties`);
          console.log('AI Response:', data.response);
          data.results.forEach(property => {
            console.log(`${property.title} - ${property.priceInEUR} EUR`);
            if (property.media?.infoPackUrl) {
              console.log('Info Pack:', property.media.infoPackUrl);
            }
            if (property.location?.mapLink) {
              console.log('Map:', property.location.mapLink);
            }
            if (property.media?.imageUrls?.length > 0) {
              console.log(`Images: ${property.media.imageUrls.length} photos`);
            }
          });
          break;
          
        case 'complete':
          console.log('Stream complete');
          break;
      }
    }
  }
}
```

**Property Result Structure:**
```typescript
interface PropertyResult {
  id: string;
  title: string;
  price: number;
  currency: "EUR" | "BGN" | "USD";
  priceInEUR: number;          // Converted price
  location: {
    city: string;
    area?: string;
    address?: string;
    mapLink?: string;          // Google Maps or similar link
  };
  type: "apartment" | "house" | "commercial";
  features: {
    bedrooms?: number;
    bathrooms?: number;
    area?: number;             // Square meters
    floor?: number;
    parking?: boolean;
    garden?: boolean;
    // ... other features
  };
  description: string;
  media?: {
    imageUrls?: string[];      // Array of image URLs for gallery
    infoPackUrl?: string;      // PDF info pack download link
  };
  contact: {
    phone?: string;
    email?: string;
    agent?: string;
  };
}
```

**Enhanced Property Display Features:**
The web interface now includes interactive property links:
- **Info Pack Button**: Downloads PDF property information when available
- **Map/Location Button**: Opens location in maps application
- **Photo Gallery**: Displays property images in a modal viewer with navigation
  - Full-screen image display
  - Previous/next navigation
  - Image counter
  - Keyboard controls (Escape to close)
  - Click outside to close
```

---

### 3. Simple Chat

Traditional JSON response for AI conversation with auto-detection capabilities.

**Endpoint:** `POST /api/chat-simple`

**Request Body:**
```typescript
interface SimpleChatRequest {
  message: string;                    // Required: User's query (property search or general conversation)
  userProfile?: UserProfile;          // Optional: User profile for personalized responses
  conversationHistory?: ConversationMessage[]; // Optional: Enhanced conversation context
}
```

**UserProfile and ConversationMessage interfaces are the same as defined in the Streaming Chat section above.**

**AI Auto-Detection:**
The system automatically determines whether your message requires:
- **Property Search**: Returns property listings with search results
- **General Conversation**: Provides conversational AI responses about real estate topics

**Response:**
```typescript
interface SimpleChatResponse {
  success: boolean;
  error?: string;
  data?: {
    response: string;                 // AI-generated response
    isPropertySearch: boolean;        // Whether property search was triggered
    propertyResults?: {
      results: PropertyResult[];      // Array of matching properties (if property search)
      searchCriteria: {              // Extracted search criteria
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        currency?: string;
        propertyType?: string;
        bedrooms?: number;
        bathrooms?: number;
        features?: string[];
      };
      totalFound: number;            // Number of properties found
      processingTime: number;        // Search time in milliseconds
    };
    propertyInfoResult?: {
      success: boolean;               // Whether the property info request was successful
      propertiesFound: number;        // Number of properties found
      propertyData: Property[];       // Array of detailed property data
      geminiResponse: string;         // AI-generated detailed property description
      processingTime: number;         // Processing time in milliseconds
      isPropertyInfoRequest: boolean; // Always true for property info requests
    };
  };
}
```

**Example Requests:**

**Property Search:**
```javascript
const response = await fetch('http://localhost:8000/api/chat-simple', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Find me a modern house with a garden near Plovdiv under 200k EUR',    userProfile: {
      name: 'Maria',
      email: 'maria@example.com',
      phone: '+359 888 234 567',
      preferences: {
        propertyType: 'house',
        transactionType: 'buy',
        budget: '150k-250k EUR',
        additionalSpecifications: 'garden, modern, parking'
      }
    }
  })
});

const result = await response.json();

if (result.success) {
  console.log('AI Response:', result.data.response);
  console.log('Is Property Search:', result.data.isPropertySearch); // true
  
  if (result.data.propertyResults) {
    console.log('Properties Found:', result.data.propertyResults.totalFound);
    console.log('Search Time:', result.data.propertyResults.processingTime + 'ms');
    
    // Process properties
    result.data.propertyResults.results.forEach(property => {
      console.log(`${property.title} - ${property.priceInEUR} EUR`);
    });
  }
} else {
  console.error('Error:', result.error);
}
```

**General Conversation:**
```javascript
const response = await fetch('http://localhost:8000/api/chat-simple', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'What are the best neighborhoods in Sofia for families?',    userProfile: {
      name: 'Alex',
      email: 'alex@example.com',
      phone: '+359 888 345 678',
      preferences: {
        propertyType: 'apartment',
        additionalSpecifications: 'family-friendly, schools nearby'
      }
    },
    conversationHistory: [
      {
        role: 'user',
        content: 'I\'m looking to move to Bulgaria'
      },
      {
        role: 'assistant',
        content: 'Hi Alex! Bulgaria is a great choice for families! Are you considering Sofia specifically?'
      }
    ]
  })
});

const result = await response.json();

if (result.success) {
  console.log('AI Response:', result.data.response);
  console.log('Is Property Search:', result.data.isPropertySearch); // false
  // No propertyResults for general conversations
} else {
  console.error('Error:', result.error);
}
```

---

### 4. Property Info Chat

Get detailed information about specific properties.

**Endpoint:** `POST /api/chat-simple`

**Request Body:**
```typescript
interface PropertyInfoChatRequest {
  message: string;                    // Required: User's query for property details
  userProfile?: UserProfile;          // Optional: User profile for personalized responses
  conversationHistory?: ConversationMessage[]; // Optional: Enhanced conversation context
}
```

**UserProfile and ConversationMessage interfaces are the same as defined in the Streaming Chat section above.**

**AI Auto-Detection:**
The system automatically determines whether your message requires:
- **Property Info Request**: Returns detailed information about a specific property
- **General Conversation**: Provides conversational AI responses about real estate topics

**Response:**
```typescript
interface PropertyInfoChatResponse {
  success: boolean;
  error?: string;
  data?: {
    response: string;                 // AI-generated response
    isPropertySearch: boolean;        // Whether property search was triggered
    propertyInfoResult?: {
      propertiesFound: number;        // Number of properties found
      processingTime: number;        // Processing time in milliseconds
      propertyData: PropertyResult[];  // Array of property details
    };
  };
}
```

**Example Requests:**

**Property Info Request:**
```javascript
const response = await fetch('http://localhost:8000/api/chat-simple', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Tell me more details about property prop_01'
  })
});

const result = await response.json();

if (result.success) {
  console.log('AI Response:', result.data.response);
  console.log('Is Property Search:', result.data.isPropertySearch); // false
  
  if (result.data.propertyInfoResult) {
    console.log('Properties Found:', result.data.propertyInfoResult.propertiesFound);
    console.log('Info Processing Time:', result.data.propertyInfoResult.processingTime + 'ms');
    
    // Process property data
    result.data.propertyInfoResult.propertyData.forEach(property => {
      console.log(`${property.title} - ${property.priceInEUR} EUR`);
      console.log('Description:', property.description);
    });
  }
}
```

**General Conversation:**
```javascript
const response = await fetch('http://localhost:8000/api/chat-simple', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'What are the best neighborhoods in Sofia for families?',    userProfile: {
      name: 'Sarah',
      email: 'sarah@example.com',
      phone: '+359 888 456 789',
      preferences: {
        propertyType: 'house',
        additionalSpecifications: 'schools nearby, safe area'
      }
    },
    conversationHistory: [
      {
        role: 'user',
        content: 'I\'m looking to move to Bulgaria'
      },
      {
        role: 'assistant', 
        content: 'Hi Sarah! Bulgaria is a great choice for families! Are you considering Sofia specifically?'
      }
    ]
  })
});

const result = await response.json();

if (result.success) {
  console.log('AI Response:', result.data.response);
  console.log('Is Property Search:', result.data.isPropertySearch); // false
  // No propertyResults for general conversations
} else {
  console.error('Error:', result.error);
}
```

---

### 5. Interactive Web Client

Access the built-in web interface for testing with enhanced conversation capabilities.

**Endpoint:** `GET /`

**Response:** HTML page with interactive chat interface

**Features:**
- **Intelligent Auto-Detection**: Automatically detects property searches vs general conversation
- **Real-time Streaming**: Live AI responses with enhanced content filtering
- **Dual Response Types**: 
  - Streaming content for general conversations
  - Complete property results for searches
- **Enhanced Property Display**: Interactive links and media:
  - Property info pack downloads (PDF)
  - Map/location links
  - Photo gallery with modal viewer
- **Conversation History**: Maintains context across messages
- **Mobile-Responsive Design**: Works on all devices
- **Advanced Filtering**: Raw API data filtered from user-visible responses

**Auto-Detection Examples:**
- `"Tell me about Sofia neighborhoods"` → General conversation (streaming response)
- `"2-bedroom apartment in Sofia under 150k EUR"` → Property search (property results)
- `"What's the average price in Plovdiv?"` → General conversation with real estate context
- `"House with garden near beach"` → Property search with location filtering

**Example:**
```bash
# Open in browser
http://localhost:8000/
```

---

## Property Display Features

The web interface includes enhanced property display functionality with interactive links and media:

### Property Info Packs
- **Button**: Blue "📄 Info Pack" button appears when `media.infoPackUrl` is available
- **Functionality**: Downloads PDF property information directly
- **Format**: Opens PDF in new tab/window for viewing or download

### Map and Location Links
- **Button**: Green "📍 Location" button appears when `location.mapLink` is available  
- **Functionality**: Opens location in default maps application (Google Maps, Apple Maps, etc.)
- **Format**: Launches external mapping service with property location

### Photo Gallery
- **Button**: Yellow "📸 Photos (X)" button shows when `media.imageUrls` array contains images
- **Count Display**: Shows number of available images in button text
- **Modal Viewer**: 
  - Full-screen overlay display
  - Navigation controls (Previous/Next buttons)
  - Image counter showing current position (e.g., "2 / 5")
  - Keyboard support (Escape key to close)
  - Click outside image to close
  - Responsive design for mobile devices

### Implementation Example
```javascript
// Example property object with enhanced media links
{
  "id": "prop_01",
  "title": "Modern 2-Bedroom Apartment in Sofia Center",
  "price": 145000,
  "currency": "EUR",
  "location": {
    "city": "Sofia",
    "area": "Center",
    "mapLink": "https://maps.google.com/maps?q=42.6977,23.3219"
  },
  "media": {
    "infoPackUrl": "https://example.com/properties/prop_01_info.pdf",
    "imageUrls": [
      "https://example.com/images/prop_01_living_room.jpg",
      "https://example.com/images/prop_01_kitchen.jpg",
      "https://example.com/images/prop_01_bedroom.jpg"
    ]
  },
  // ... other property fields
}
```

---

## Request Examples

### Bash/cURL Examples

**Health Check:**
```bash
curl -X GET http://localhost:8000/health
```

**Simple Chat:**
```bash
curl -X POST http://localhost:8000/api/chat-simple \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want a 3-bedroom apartment in Sofia under 200,000 EUR"
  }'
```

**Streaming Chat:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Find me a house with a garden near the beach"
  }'
```

### JavaScript/Fetch Examples

**Health Check:**
```javascript
const health = await fetch('http://localhost:8000/health');
const status = await health.json();
console.log('Server status:', status.status);
```

**Simple Chat with Error Handling:**
```javascript
try {
  const response = await fetch('http://localhost:8000/api/chat-simple', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'I need a family house in Varna with parking'
    })
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${result.error}`);
  }

  if (result.success) {
    console.log('AI Response:', result.data.response);
    console.log('Properties:', result.data.propertyResults?.results);
  } else {
    console.error('API Error:', result.error);
  }
} catch (error) {
  console.error('Network Error:', error.message);
}
```

**Streaming Chat with Full Event Handling:**
```javascript
async function streamingChat(message, conversationHistory = []) {
  try {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiResponse = '';
    let properties = [];
    let isPropertySearch = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            
            switch (data.type) {
              case 'content':
                // General conversation - streaming content
                process.stdout.write(data.content); // Real-time streaming
                aiResponse += data.content;
                break;
                
              case 'properties':
                // Property search - complete results
                isPropertySearch = true;
                properties = data.results || [];
                aiResponse = data.response || '';
                console.log(`\nFound ${data.count} properties`);
                console.log('AI Response:', data.response);
                break;
                
              case 'complete':
                console.log('\nStream completed');
                return {
                  response: aiResponse,
                  properties: properties,
                  isPropertySearch: isPropertySearch
                };
            }
          } catch (parseError) {
            console.warn('Failed to parse SSE data:', parseError);
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  }
}

// Usage Examples
console.log('=== Property Search Example ===');
streamingChat('I want a luxury apartment in Sofia with a view')
  .then(result => {
    console.log(`\nProperty search: ${result.isPropertySearch}`);
    console.log(`Properties found: ${result.properties.length}`);
  });

console.log('\n=== General Conversation Example ===');
streamingChat('What are the best areas in Sofia for young professionals?')
  .then(result => {
    console.log(`\nProperty search: ${result.isPropertySearch}`);
    console.log(`Response length: ${result.response.length} characters`);
  });

console.log('\n=== Conversation with History ===');
const history = [
  { role: 'user', content: 'I\'m moving to Bulgaria' },
  { role: 'assistant', content: 'Bulgaria has strong growth potential...' }
];
streamingChat('What should I know about Sofia?', history)
  .then(result => {
    console.log(`\nContextual response: ${result.response.substring(0, 100)}...`);
  });

console.log('\n=== Enhanced Conversation with Property Metadata ===');
const enhancedHistory = [
  { 
    role: 'user', 
    content: 'Find 2-bedroom apartments in Sofia under 120k EUR' 
  },
  { 
    role: 'assistant', 
    content: 'I found 8 apartments matching your criteria in Sofia.',
    propertyMetadata: {
      propertyIds: ['prop_01', 'prop_02', 'prop_03'],
      propertyType: 'search',
      basicInfo: {
        'prop_01': {'title': 'Modern Apartment', 'price': 115000, 'location': 'Sofia Center', 'type': 'apartment'},
        'prop_02': {'title': 'Bright 2BR', 'price': 108000, 'location': 'Lozenets', 'type': 'apartment'},
        'prop_03': {'title': 'Renovated Flat', 'price': 118000, 'location': 'Mladost', 'type': 'apartment'}
      },
      searchCriteria: { location: 'Sofia', bedrooms: 2, maxPrice: 120000 }
    }
  }
];

// Follow-up question using metadata context
streamingChat('Tell me more about the first property', enhancedHistory)
  .then(result => {
    console.log(`\nProperty info request: ${result.isPropertySearch}`);
    console.log(`AI automatically knew to get details for prop_01`);
  });

// Comparison request using metadata
streamingChat('Compare the first three properties', enhancedHistory)
  .then(result => {
    console.log(`\nComparison request using metadata from previous search`);
    console.log(`AI compared properties: prop_01, prop_02, prop_03`);
  });
```

### Python Examples

**Simple Chat with Auto-Detection:**
```python
import requests
import json

def simple_chat(message, conversation_history=None, user_profile=None):
    url = 'http://localhost:8000/api/chat-simple'
    payload = {
        'message': message
    }
    
    if conversation_history:
        payload['conversationHistory'] = conversation_history
    
    if user_profile:
        payload['userProfile'] = user_profile
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        result = response.json()
        
        if result['success']:
            return result['data']
        else:
            raise Exception(f"API Error: {result['error']}")
            
    except requests.exceptions.RequestException as e:
        raise Exception(f"Request failed: {e}")

# Property Search Example
try:
    result = simple_chat(
        'Find me a 2-bedroom apartment in Plovdiv under 120k EUR',        user_profile={
            'name': 'Maria',
            'email': 'maria@example.com',
            'phone': '+359 888 234 567',
            'preferences': {
                'propertyType': 'apartment',
                'transactionType': 'buy',
                'budget': '100k-150k EUR'
            }
        }
    )
    print('AI Response:', result['response'])
    print('Is Property Search:', result['isPropertySearch'])
    
    if result['isPropertySearch'] and result.get('propertyResults'):
        print('Properties found:', len(result['propertyResults']['results']))
        print('Search time:', result['propertyResults']['processingTime'], 'ms')
except Exception as e:
    print('Error:', e)

# General Conversation Example
try:
    history = [
        {'role': 'user', 'content': 'I\'m considering Bulgaria for investment'},
        {'role': 'assistant', 'content': 'Hi John! Bulgaria has strong growth potential...'}
    ]
    result = simple_chat(
        'What are the tax implications?', 
        conversation_history=history,        user_profile={
            'name': 'John',
            'email': 'john@example.com',
            'phone': '+359 888 123 456',
            'preferences': {
                'transactionType': 'buy',
                'budget': '200k-500k EUR'
            }
        }
    )
    print('\nConversation Response:', result['response'])
    print('Is Property Search:', result['isPropertySearch'])  # Should be False
except Exception as e:
    print('Error:', e)
```

**Streaming Chat with Auto-Detection:**
```python
import requests
import json
import sys

def streaming_chat(message, conversation_history=None, user_profile=None):
    url = 'http://localhost:8000/api/chat'
    payload = {'message': message}
    
    if conversation_history:
        payload['conversationHistory'] = conversation_history
    
    if user_profile:
        payload['userProfile'] = user_profile
    
    try:
        response = requests.post(url, json=payload, stream=True)
        response.raise_for_status()
        
        ai_response = ''
        properties = []
        is_property_search = False
        
        for line in response.iter_lines():
            if line:
                line_str = line.decode('utf-8')
                if line_str.startswith('data: '):
                    try:
                        data = json.loads(line_str[6:])
                        
                        if data['type'] == 'content':
                            # General conversation - stream content
                            content = data['content']
                            print(content, end='', flush=True)
                            ai_response += content
                            
                        elif data['type'] == 'properties':
                            # Property search - complete results
                            is_property_search = True
                            properties = data.get('results', [])
                            ai_response = data.get('response', '')
                            print(f"\n[Found {data['count']} properties]")
                            print(f"AI Response: {ai_response}")
                            
                        elif data['type'] == 'complete':
                            print('\n[Stream complete]')
                            break
                            
                    except json.JSONDecodeError:
                        continue
        
        return {
            'response': ai_response,
            'properties': properties,
            'isPropertySearch': is_property_search
        }
        
    except requests.exceptions.RequestException as e:
        raise Exception(f"Streaming request failed: {e}")

# Property Search Example
print("=== Property Search Example ===")
try:
    result = streaming_chat(
        'I need a house near the sea with a pool',        user_profile={
            'name': 'Elena',
            'email': 'elena@example.com',
            'phone': '+359 888 345 678',
            'preferences': {
                'propertyType': 'house',
                'transactionType': 'buy',
                'additionalSpecifications': 'pool, sea view'
            }
        }
    )
    print(f"\nProperty search: {result['isPropertySearch']}")
    print(f"Properties found: {len(result['properties'])}")
except Exception as e:
    print('Error:', e)

# General Conversation Example  
print("\n=== General Conversation Example ===")
try:
    result = streaming_chat(
        'What neighborhoods in Sofia are good for families?',
        user_profile={
            'name': 'Anna',
            'preferences': {
                'additionalSpecifications': 'family-friendly, good schools'
            }
        }
    )
    print(f"\nProperty search: {result['isPropertySearch']}")
    print(f"Response length: {len(result['response'])} characters")
except Exception as e:
    print('Error:', e)

# Conversation with Context
print("\n=== Contextual Conversation ===")
history = [
    {'role': 'user', 'content': 'I want to invest in Bulgarian real estate'},
    {'role': 'assistant', 'content': 'Hi Peter! That\'s a smart choice! Bulgaria has strong growth potential...'}
]
try:
    result = streaming_chat(
        'What about rental yields?', 
        conversation_history=history,        user_profile={
            'name': 'Peter',
            'email': 'peter@example.com',
            'phone': '+359 888 456 789',
            'preferences': {
                'transactionType': 'buy',
                'budget': '300k+ EUR'
            }
        }
    )
    print(f"\nContextual response received: {len(result['response'])} chars")
except Exception as e:
    print('Error:', e)

# Enhanced Conversation with Property Metadata
print("\n=== Enhanced Conversation with Property Metadata ===")
enhanced_history = [
    { 
        'role': 'user', 
        'content': 'Find 2-bedroom apartments in Sofia under 120k EUR' 
    },
    { 
        'role': 'assistant', 
        'content': 'I found 8 apartments matching your criteria in Sofia.',
        'propertyMetadata': {
          propertyIds: ['prop_01', 'prop_02', 'prop_03'],
          propertyType: 'search',
          basicInfo: {
            'prop_01': {'title': 'Modern Apartment', 'price': 115000, 'location': 'Sofia Center', 'type': 'apartment'},
            'prop_02': {'title': 'Bright 2BR', 'price': 108000, 'location': 'Lozenets', 'type': 'apartment'},
            'prop_03': {'title': 'Renovated Flat', 'price': 118000, 'location': 'Mladost', 'type': 'apartment'}
          },
          searchCriteria: { location: 'Sofia', bedrooms: 2, maxPrice: 120000 }
        }
    }
]

# Follow-up question using metadata context
try:
    result = streaming_chat(
        'Tell me more about the first property', 
        conversation_history=enhanced_history,        user_profile={
            'name': 'Viktor',
            'email': 'viktor@example.com',
            'phone': '+359 888 567 890',
            'preferences': {
                'propertyType': 'apartment',
                'budget': '100k-120k EUR'
            }
        }
    )
    print(f"\nProperty info request: {result['isPropertySearch']}")
    print("AI automatically knew to get details for prop_01")
except Exception as e:
    print('Error:', e)

# Comparison request using metadata
try:
    result = streaming_chat(
        'Compare the first three properties', 
        conversation_history=enhanced_history,        user_profile={
            'name': 'Viktor',
            'email': 'viktor@example.com',
            'phone': '+359 888 567 890',
            'preferences': {
                'transactionType': 'buy',
                'additionalSpecifications': 'good investment potential'
            }
        }
    )
    print(f"\nComparison request using metadata from previous search")
    print("AI compared properties: prop_01, prop_02, prop_03")
except Exception as e:
    print('Error:', e)
```

---

## Response Times and Performance

### Expected Response Times
- **Health Check:** < 10ms
- **Simple Chat (General Conversation):** 1.0 - 3.0 seconds
- **Simple Chat (Property Search):** 1.5 - 4.3 seconds  
- **Streaming Chat (General):** First content within 0.3 - 1.0 seconds (streaming)
- **Streaming Chat (Property Search):** Response within 0.5 - 1.5 seconds (single event with properties)

### Performance Factors
- **Auto-Detection Processing:** ~100-200ms for query classification
- **AI Processing:** Depends on OpenAI API response time
- **Property Search:** ~700ms for 3,693 properties (when triggered)
- **Content Filtering:** ~50ms for response cleanup
- **Currency Conversion:** Real-time rates (cached)
- **Network Latency:** Varies by connection

### Optimization Features
- **Single API Call**: Auto-detection eliminates need for separate classification requests
- **Enhanced Filtering**: Raw API data filtered from responses for cleaner output
- **Streaming Content**: General conversations stream in real-time for better UX
- **Intelligent Caching**: Property data and currency rates cached for performance
- **Context Preservation**: Conversation history maintained efficiently

### Auto-Detection Performance
- **Property Search Queries**: Detected with 95%+ accuracy
- **General Conversations**: Properly routed to conversational AI
- **Mixed Queries**: Intelligently handled based on primary intent
- **Context Awareness**: Previous conversation considered in detection

### Optimization Tips
- Use streaming endpoints for better perceived performance
- Leverage auto-detection to avoid manual query classification
- Implement conversation history to maintain context efficiently
- Cache frequent searches and conversations for faster responses
- Consider implementing request queuing for high load
- Use the `isPropertySearch` flag to optimize client-side handling

---

## Auto-Detection and AI Features

### Intelligent Query Classification

The system uses advanced AI to automatically detect whether a user query requires property search or is a general conversation:

**Property Search Triggers:**
- Specific property requirements (bedrooms, price, location)
- Property type mentions (apartment, house, commercial)
- Location-based searches with criteria
- Price range specifications
- Feature-specific requests (garden, parking, view)

**General Conversation Triggers:**
- General questions about areas, neighborhoods, or market trends
- Real estate advice requests
- Investment guidance
- Legal or procedural questions
- Continuation of existing conversations

**Examples:**

| Query | Detection | Response Type |
|-------|-----------|---------------|
| `"2-bedroom apartment in Sofia under 150k EUR"` | Property Search | Property listings + AI analysis |
| `"What neighborhoods in Sofia are good for families?"` | General Conversation | Streaming AI advice |
| `"House with garden near Plovdiv"` | Property Search | Property listings + AI analysis |  
| `"Tell me about Bulgarian property taxes"` | General Conversation | Streaming AI explanation |
| `"What's the average price in Varna?"` | General Conversation | Streaming market analysis |
| `"Show me luxury properties with sea view"` | Property Search | Property listings + AI analysis |

### Enhanced Content Filtering

The system includes intelligent content filtering to ensure clean, user-friendly responses:

**Filtered Content:**
- Raw API response data and metadata
- Internal processing information
- JSON artifacts and formatting
- Debug information and logs
- System-level error details

**Preserved Content:**
- Meaningful AI responses and analysis
- Property descriptions and details
- Conversation context and history
- User-relevant information
- Market insights and advice

### Conversation Context Management

**Context Preservation:**
- Maintains conversation history across multiple queries
- Considers previous messages in auto-detection decisions
- Provides contextually aware responses
- Supports follow-up questions and clarifications

**Smart Filtering:**
- Removes raw API data from conversation history
- Preserves meaningful dialogue content
- Optimizes context for better AI performance
- Maintains conversation flow and continuity

---

## Rate Limiting and Usage

### Current Limits
- No rate limiting implemented (development mode)
- OpenAI API limits apply (depends on your API plan)

### Recommended Production Limits
- **Requests per minute:** 100 per IP
- **Concurrent streams:** 10 per IP
- **Message length:** 2000 characters max
- **Conversation history:** 20 messages max

### Implementation Example
```javascript
// Example rate limiting middleware
const rateLimiter = {
  requests: new Map(),
  
  checkLimit(ip, limit = 100, window = 60000) {
    const now = Date.now();
    const requests = this.requests.get(ip) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < window);
    
    if (validRequests.length >= limit) {
      return false; // Rate limited
    }
    
    validRequests.push(now);
    this.requests.set(ip, validRequests);
    return true; // Request allowed
  }
};
```

---

## Troubleshooting

### Common Issues

**1. Server Won't Start**
```bash
# Check if port is in use
netstat -an | find "8000"

# Kill existing process
taskkill /F /PID <process_id>
```

**2. OpenAI API Errors**
- Verify API key in `.env` file
- Check OpenAI account credits/limits
- Ensure model name is correct

**3. Property Search Issues**
- Verify property JSON files exist in `/properties/`
- Check file permissions
- Validate JSON format

**4. CORS Issues**
```javascript
// Server allows all origins by default
// For production, restrict origins:
"Access-Control-Allow-Origin": "https://yourdomain.com"
```

**5. Streaming Connection Issues**
- Ensure browser supports Server-Sent Events
- Check for proxy/firewall blocking
- Verify proper Content-Type handling

**6. Auto-Detection Issues**
- If queries are misclassified, check for ambiguous wording
- Include specific criteria for property searches (price, location, features)
- Use conversation history to provide context for better detection
- Verify that general questions don't include property-specific terms

**7. Content Filtering Issues**
- If responses contain raw API data, check filtering implementation
- Ensure conversation history is being properly cleaned
- Verify that meaningful content is preserved in responses

**8. Streaming Content Issues**
- For general conversations, content should stream in real-time
- For property searches, expect single complete response
- Check network connectivity if streaming stops mid-response

### Debug Mode
Enable detailed logging:
```env
LOG_LEVEL=debug
```

### Health Checks
Monitor server health:
```bash
# Automated health monitoring
while true; do
  curl -s http://localhost:8000/health | jq .status
  sleep 30
done
```

---

## API Versioning

Current version: `2.2.0`

**Version 2.2.0 Features (Latest):**
- ✅ **Enhanced UserProfile Integration**: Comprehensive user profile support with name and granular preferences
- ✅ **Modular AI Architecture**: Refactored AI code into organized modules (types.ts, utils.ts, prompt.ts, index.ts)
- ✅ **Personalized Responses**: AI addresses users by name and provides contextual recommendations
- ✅ **Updated PropertyMetadata Structure**: Improved basicInfo structure with detailed property information
- ✅ **Override Priority Rules**: Clear documentation of when userProfile provides fallback vs. chat override
- ✅ **Enhanced Type Safety**: Comprehensive TypeScript interfaces and improved error handling
- ✅ **Consistent API Structure**: Unified request/response interfaces across all endpoints

**Version 2.0.0 Features:**
- ✅ Intelligent auto-detection of property searches vs general conversation
- ✅ Enhanced streaming with real-time content for conversations
- ✅ Advanced content filtering for cleaner responses
- ✅ Improved conversation context management
- ✅ Single API call optimization with auto-detection
- ✅ Enhanced property search integration
- ✅ Property info feature for detailed property information
- ✅ Better error handling and response structure

**Version 2.1.0 Features:**
- ✅ **Property Metadata Integration**: Enhanced conversation history with property-specific context
- ✅ **Contextual Property References**: Support for "tell me about the first property" and similar natural language
- ✅ **Advanced Property Comparisons**: Compare properties using conversation metadata
- ✅ **Enhanced Memory**: AI remembers specific properties discussed across conversation turns
- ✅ **Efficient Property Handling**: Reduced API calls through property ID references
- ✅ **Cross-Reference Capabilities**: Compare properties from different searches in same conversation
- ✅ **Backward Compatibility**: Optional propertyMetadata field doesn't break existing implementations

**Migration from v2.1.x:**
- Enhanced `userProfile` structure with granular preferences
- Improved `PropertyMetadata.basicInfo` structure
- AI now provides personalized responses using user names
- All existing functionality remains compatible

**Migration from v2.0.x:**
- All existing endpoints remain fully compatible
- Optional `propertyMetadata` field added to conversation history messages
- Enhanced AI understanding of contextual property references
- Improved performance for follow-up property questions

**Migration from v1.x:**
- All existing endpoints remain compatible
- New `isPropertySearch` field added to responses
- Enhanced streaming events (added `content` type for conversations)
- Improved response filtering (automatic cleanup of raw API data)

Future versions will maintain backward compatibility with proper deprecation notices.

Version information available at:
```
GET /health
```

---

## Summary

The Property AI Search Server features intelligent auto-detection capabilities with enhanced conversation context management through property metadata integration and comprehensive user profile support. This enables seamless property searches, detailed property information, personalized AI interactions, and natural follow-up conversations. Key improvements include:

**🤖 Auto-Detection**: Automatically determines whether queries require property search, property info retrieval, or conversational AI
**� Personalized Experience**: User profiles enable personalized AI responses and intelligent preference fallbacks
**�🚀 Enhanced Streaming**: Real-time content streaming for conversations, complete results for property searches and info requests
**🔧 Smart Filtering**: Automatic cleanup of raw API data for cleaner user experiences
**💬 Enhanced Context Management**: Conversation history with property metadata for contextual follow-ups and comparisons
**📊 Property Details**: In-depth property information retrieval with AI-generated descriptions
**🔗 Property Metadata**: Track specific properties across conversations for natural references and comparisons
**🎯 Contextual Interactions**: Support for "tell me about the first property" and "compare these apartments"
**⚡ Performance**: Single API call optimization with 95%+ detection accuracy and efficient property referencing
**🏗️ Modular Architecture**: Clean, maintainable AI code structure with separation of concerns
**🔄 Backward Compatibility**: All existing functionality preserved with enhanced features

### New Capabilities with Property Metadata

- **Contextual Follow-ups**: Reference previously discussed properties without repeating searches
- **Natural Comparisons**: Compare properties using phrases like "compare them" or "which is better?"
- **Enhanced Memory**: The AI remembers specific properties discussed and can reference them in ongoing conversations
- **Efficient Processing**: Avoids redundant API calls by leveraging property IDs from conversation history
- **Cross-Reference Searches**: Compare properties from different searches within the same conversation

The system now provides a unified interface that intelligently routes queries to the appropriate processing pipeline while maintaining rich conversation context, delivering optimal user experiences for property discovery, detailed property information, natural follow-up questions, and comprehensive real estate consultation.

---

## Enhanced Conversation Features

### Property Metadata Integration

The API now supports enhanced conversation context through property metadata, allowing for more natural and contextual interactions with previously discussed properties.

**PropertyMetadata Structure:**
```typescript
interface PropertyMetadata {
  propertyIds: string[];              // Array of property IDs referenced in this message
  propertyType: "search" | "info";   // Type of property interaction
  basicInfo?: {                      // Optional basic information for context
    searchCriteria?: any;            // Original search criteria used
    resultCount?: number;            // Number of properties found
    timestamp?: string;              // When the search/info was performed
  };
}
```

**Enhanced ConversationMessage:**
```typescript
interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  propertyMetadata?: PropertyMetadata; // Optional property-specific context
}
```

### Benefits of Property Metadata

1. **Contextual Follow-ups**: Users can ask "Tell me more about the first property" or "Compare these apartments" without repeating search criteria
2. **Property Comparisons**: Natural language requests like "compare them" or "which is better?" using metadata from previous searches
3. **Enhanced Memory**: The AI remembers specific properties discussed and can reference them in ongoing conversations
4. **Efficient Processing**: Avoids redundant searches by leveraging property IDs from conversation history

### Example Usage Scenarios

**Scenario 1: Property Search with Follow-up**
```javascript
// Initial search
{
  message: "Find 2-bedroom apartments in Sofia under 150k EUR",
  conversationHistory: []
}

// AI Response includes propertyMetadata
{
  role: "assistant",
  content: "I found 12 apartments matching your criteria...",
  propertyMetadata: {
    propertyIds: ["prop_01", "prop_02", "prop_03"],
    propertyType: "search",
    basicInfo: {
      searchCriteria: { bedrooms: 2, location: "Sofia", maxPrice: 150000 },
      resultCount: 12,
      timestamp: "2025-06-17T10:30:00Z"
    }
  }
}

// Follow-up request using metadata
{
  message: "Tell me more about the first property",
  conversationHistory: [/* previous messages with metadata */]
}
// AI automatically knows to get details for "prop_01"
```

**Scenario 2: Property Comparison**
```javascript
// After viewing multiple properties
{
  message: "Compare the first three properties",
  conversationHistory: [
    {
      role: "assistant",
      content: "Here are properties in Lozenets...",
      propertyMetadata: {
        propertyIds: ["prop_05", "prop_07", "prop_12"],
        propertyType: "search"
      }
    }
  ]
}
// AI uses metadata to compare properties prop_05, prop_07, and prop_12
```

**Scenario 3: Cross-Reference Searches**
```javascript
// Multiple searches in conversation
{
  message: "How do these compare to the Sofia Center apartments we looked at earlier?",
  conversationHistory: [
    {
      role: "assistant",
      content: "Found 8 apartments in Sofia Center...",
      propertyMetadata: {
        propertyIds: ["prop_20", "prop_21"],
        propertyType: "search",
        basicInfo: { location: "Sofia Center" }
      }
    },
    {
      role: "assistant", 
      content: "Here are 5 apartments in Lozenets...",
      propertyMetadata: {
        propertyIds: ["prop_30", "prop_31"],
        propertyType: "search",
        basicInfo: { location: "Lozenets" }
      }
    }
  ]
}
// AI can reference and compare properties from both searches
```

### Implementation Notes

- **Automatic Population**: The server automatically populates `propertyMetadata` for assistant responses that include property results
- **Client Handling**: Frontend applications can optionally include metadata in conversation history for enhanced context
- **Backward Compatibility**: The `propertyMetadata` field is optional and doesn't break existing implementations
- **Performance**: Reduces API calls by enabling direct property references without new searches
