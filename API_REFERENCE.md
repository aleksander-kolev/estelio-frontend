# Property AI Server - API Reference

Quick reference for request/response structures and endpoints.

**📖 Full Documentation:** For detailed examples, explanations, and usage guides, see [API.md](./API.md)

**Base URL:** `http://localhost:8000`  
**Version:** `2.2.0`

---

## Core Types

```typescript
interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  preferences?: {
    propertyType?: string;
    budget?: string;
    transactionType?: "buy" | "rent" | "both";
    additionalSpecifications?: string;
    location?: string;
  };
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  propertyMetadata?: PropertyMetadata;
}

interface PropertyMetadata {
  propertyIds?: string[];
  propertyType?: "search" | "info";
  basicInfo?: Record<string, {
    title?: string;
    price?: number;
    location?: string;
    type?: string;
  }>;
  searchCriteria?: Record<string, unknown>;
  propertyDetails?: Record<string, unknown>;
}

interface PropertyResult {
  id: string;
  title: string;
  price: number;
  currency: "EUR" | "BGN" | "USD";
  priceInEUR: number;
  location: {
    city: string;
    area?: string;
    address?: string;
    mapLink?: string;
  };
  type: "apartment" | "house" | "commercial";
  features: {
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    floor?: number;
    parking?: boolean;
    garden?: boolean;
  };
  description: string;
  media?: {
    imageUrls?: string[];
    infoPackUrl?: string;
  };
  contact: {
    phone?: string;
    email?: string;
    agent?: string;
  };
}
```

---

## 1. Health Check

**`GET /health`**

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-17T17:01:36.273Z",
  "version": "2.2.0"
}
```

---

## 2. Streaming Chat

**`POST /api/chat`**

**Request:**
```typescript
{
  message: string;
  userProfile?: UserProfile;
  conversationHistory?: ConversationMessage[];
}
```

**Response:** Server-Sent Events (SSE)
```
data: {"type": "content", "content": "I'd be happy to help..."}
data: {"type": "properties", "count": 15, "results": [...], "response": "Here are 15 properties..."}
data: {"type": "complete"}
```

**Event Types:**
- `content` - Streaming text for general conversation
- `properties` - Complete property search results
- `complete` - Stream end marker

---

## 3. Simple Chat

**`POST /api/chat-simple`**

**Request:**
```typescript
{
  message: string;
  userProfile?: UserProfile;
  conversationHistory?: ConversationMessage[];
}
```

**Response:**
```typescript
{
  success: boolean;
  error?: string;
  data?: {
    response: string;
    isPropertySearch: boolean;
    propertyResults?: {
      results: PropertyResult[];
      searchCriteria: {
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        currency?: string;
        propertyType?: string;
        bedrooms?: number;
        bathrooms?: number;
        features?: string[];
      };
      totalFound: number;
      processingTime: number;
    };
    propertyInfoResult?: {
      success: boolean;
      propertiesFound: number;
      propertyData: PropertyResult[];
      geminiResponse: string;
      processingTime: number;
      isPropertyInfoRequest: boolean;
    };
  };
}
```

---

## 4. Interactive Web Client

**`GET /`**

**Response:** HTML page with chat interface

**Features:**
- Auto-detection of property searches vs general conversation
- Real-time streaming responses
- Property display with interactive links (info packs, maps, photo galleries)
- Conversation history maintenance
- Mobile-responsive design

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Detailed error message"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## Usage Rules

### UserProfile Behavior
- **Name**: Enables personalized AI responses ("Hi John, I found...")
- **Preferences**: Provide fallback context when not specified in chat
- **Override**: Explicit chat input ALWAYS overrides userProfile preferences
- **Optional**: All fields are optional and enhance rather than replace interaction

### Auto-Detection
- **Property Search**: Specific criteria (price, location, features) → Returns property listings
- **General Conversation**: General questions, advice requests → Returns streaming AI responses
- **Property Info**: "Tell me about property X" → Returns detailed property information

### PropertyMetadata
- **Contextual References**: Enables "tell me about the first property" follow-ups
- **Property Comparisons**: Natural language comparisons using conversation history
- **Efficient Processing**: Avoids redundant searches by leveraging property IDs

---

## Quick Examples

### Property Search
```bash
curl -X POST http://localhost:8000/api/chat-simple \
  -H "Content-Type: application/json" \
  -d '{
    "message": "2-bedroom apartment in Sofia under 150k EUR",    "userProfile": {
      "name": "John",
      "email": "john@example.com",
      "phone": "+359 888 123 456",
      "preferences": {
        "propertyType": "apartment",
        "transactionType": "buy"
      }
    }
  }'
```

### General Conversation
```bash
curl -X POST http://localhost:8000/api/chat-simple \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What neighborhoods in Sofia are best for families?",    "userProfile": {
      "name": "Maria",
      "email": "maria@example.com", 
      "phone": "+359 888 234 567",
      "preferences": {
        "additionalSpecifications": "family-friendly, schools nearby"
      }
    }
  }'
```

### Streaming Chat
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Find luxury properties with sea view",    "userProfile": {
      "name": "Alex",
      "email": "alex@example.com",
      "phone": "+359 888 345 678", 
      "preferences": {
        "budget": "500k+ EUR",
        "additionalSpecifications": "luxury, sea view"
      }
    }
  }'
```

---

## Performance

- **Health Check:** < 10ms
- **Simple Chat:** 1.0 - 4.3 seconds
- **Streaming Chat:** First content within 0.3 - 1.5 seconds
- **Auto-Detection:** ~100-200ms for query classification
- **Property Search:** ~700ms for search processing
