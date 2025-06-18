import { PropertyResult } from "../PropertyCard";

export interface LeadCaptureData {
  name: string;
  email: string;
  phone?: string;
  transactionType: string;
  budget: string;
  propertyPreferences: string;
}

export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  properties?: PropertyResult[];
  propertyMetadata?: {
    propertyIds: string[];
    propertyType: "search" | "info";
    basicInfo?: {
      totalResults?: number;
      isPropertySearch?: boolean;
      isPropertyInfoRequest?: boolean;
      searchCriteria?: {
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        currency?: string;
        propertyType?: string;
        bedrooms?: number;
        bathrooms?: number;
        features?: string[];
      };
      processingTime?: number;
      [key: string]: any;
    };
  };
}
