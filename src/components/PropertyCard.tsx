import { useState, useEffect } from "react";
import { MapPin, Bed, Bath, Square, Car, Trees, Download, Camera, X, ChevronLeft, ChevronRight, Info } from "lucide-react";

export interface PropertyResult {
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

interface PropertyCardProps {
  property: PropertyResult;
  isPropertyInfo?: boolean;
  showStructuredData?: boolean;
  showDescription?: boolean;
  onToggleDetails?: (propertyId: string) => void;
  onToggleDescription?: (propertyId: string) => void;
  onOpenGallery?: (property: PropertyResult, imageIndex: number) => void;
}

const PropertyCard = ({ 
  property, 
  isPropertyInfo = false,
  showStructuredData: externalShowStructuredData,
  showDescription: externalShowDescription,
  onToggleDetails,
  onToggleDescription,
  onOpenGallery
}: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [internalShowStructuredData, setInternalShowStructuredData] = useState(isPropertyInfo);
  const [internalShowDescription, setInternalShowDescription] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Use external state if provided, otherwise use internal state
  const showStructuredData = externalShowStructuredData !== undefined ? externalShowStructuredData : internalShowStructuredData;
  const showDescription = externalShowDescription !== undefined ? externalShowDescription : internalShowDescription;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('bg-BG').format(price) + ' ' + currency;
  };

  const handleInfoPackDownload = () => {
    if (property.media?.infoPackUrl) {
      window.open(property.media.infoPackUrl, '_blank');
    }
  };

  const handleLocationClick = () => {
    if (property.location.mapLink) {
      window.open(property.location.mapLink, '_blank');
    }
  };
  const handlePhotoGallery = () => {
    if (property.media?.imageUrls && property.media.imageUrls.length > 0) {
      if (onOpenGallery) {
        onOpenGallery(property, 0);
      }
    }
  };const toggleDetails = () => {
    if (onToggleDetails) {
      onToggleDetails(property.id);
    } else {
      setInternalShowStructuredData(prev => {
        const newState = !prev;        if (newState) {
          // Scroll into view after details are shown
          setTimeout(() => {
            const card = document.querySelector(`[data-property-id="${property.id}"]`);
            if (card) {
              // First scroll the card horizontally in the property list if needed
              const propertyList = card.closest('[data-property-list]');
              if (propertyList) {
                const listRect = propertyList.getBoundingClientRect();
                const cardRect = card.getBoundingClientRect();
                
                if (cardRect.right > listRect.right || cardRect.left < listRect.left) {
                  // Calculate scroll position relative to the property list container
                  const containerScrollLeft = propertyList.scrollLeft;
                  const cardOffsetLeft = (card as HTMLElement).offsetLeft;
                  const containerWidth = propertyList.clientWidth;
                  const cardWidth = card.clientWidth;
                  const scrollToPosition = cardOffsetLeft - (containerWidth - cardWidth) / 2;
                  
                  propertyList.scrollTo({
                    left: scrollToPosition,
                    behavior: 'smooth'
                  });
                }
              }
              
              // Then scroll vertically in the chat container
              setTimeout(() => {
                const chatContainer = document.querySelector('[data-chat-container]');
                if (chatContainer) {
                  const containerRect = chatContainer.getBoundingClientRect();
                  const cardRect = card.getBoundingClientRect();
                  
                  if (cardRect.bottom > containerRect.bottom) {
                    chatContainer.scrollBy({
                      top: cardRect.bottom - containerRect.bottom + 20,
                      behavior: 'smooth'
                    });
                  }
                }
              }, 100);
            }
          }, 100);
        }
        return newState;
      });
    }
  };

  const toggleDescription = () => {
    if (onToggleDescription) {
      onToggleDescription(property.id);
    } else {
      setInternalShowDescription(prev => {
        const newState = !prev;        if (newState) {
          // Scroll into view after description is shown
          setTimeout(() => {
            const card = document.querySelector(`[data-property-id="${property.id}"]`);
            if (card) {
              // First scroll the card horizontally in the property list if needed
              const propertyList = card.closest('[data-property-list]');
              if (propertyList) {
                const listRect = propertyList.getBoundingClientRect();
                const cardRect = card.getBoundingClientRect();
                
                if (cardRect.right > listRect.right || cardRect.left < listRect.left) {
                  // Calculate scroll position relative to the property list container
                  const containerScrollLeft = propertyList.scrollLeft;
                  const cardOffsetLeft = (card as HTMLElement).offsetLeft;
                  const containerWidth = propertyList.clientWidth;
                  const cardWidth = card.clientWidth;
                  const scrollToPosition = cardOffsetLeft - (containerWidth - cardWidth) / 2;
                  
                  propertyList.scrollTo({
                    left: scrollToPosition,
                    behavior: 'smooth'
                  });
                }
              }
              
              // Then scroll vertically in the chat container
              setTimeout(() => {
                const chatContainer = document.querySelector('[data-chat-container]');
                if (chatContainer) {
                  const containerRect = chatContainer.getBoundingClientRect();
                  const cardRect = card.getBoundingClientRect();
                  
                  if (cardRect.bottom > containerRect.bottom) {
                    chatContainer.scrollBy({
                      top: cardRect.bottom - containerRect.bottom + 20,
                      behavior: 'smooth'
                    });
                  }
                }
              }, 100);
            }
          }, 100);
        }
        return newState;
      });
    }  };

  const defaultImage = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop&crop=center&auto=format&q=80";
  const propertyImage = property.media?.imageUrls?.[0] || defaultImage;
  return (
    <>
      <div 
        data-property-card
        data-property-id={property.id}
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 w-full flex flex-col"
        style={{ minHeight: showStructuredData || showDescription ? 'auto' : '280px' }}
      >
        {/* Image Section - Compact */}
        <div className="relative h-24 overflow-hidden bg-gray-100">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-luximo-600 border-t-transparent"></div>
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-gray-400 text-xs">Image unavailable</div>
            </div>
          )}
          <img
            src={propertyImage}
            alt={property.title}
            className={`w-full h-full object-cover transition-all duration-300 hover:scale-105 ${
              imageLoading || imageError ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => {
              setImageLoading(false);
              setImageError(false);
            }}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
          
          {/* Price Badge - Smaller */}
          <div className="absolute top-2 left-2 bg-luximo-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
            {formatPrice(property.priceInEUR, 'EUR')}
          </div>
          
          {/* Property Type Badge - Smaller */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-md text-xs font-medium capitalize">
            {property.type}
          </div>
          
          {/* Image Count Indicator */}
          {property.media?.imageUrls && property.media.imageUrls.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <Camera size={10} />
              {property.media.imageUrls.length}
            </div>
          )}
        </div>

        {/* Content Section - Compact */}
        <div className="p-2.5 space-y-1.5 flex-1 flex flex-col">
          {/* Title - More compact */}
          <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight">
            {property.title}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-600">
            <MapPin size={12} className="text-luximo-600 flex-shrink-0" />
            <span className="text-xs">
              {property.location.city}
              {property.location.area && `, ${property.location.area}`}
            </span>
          </div>

          {/* Features - More compact */}
          <div className="flex items-center gap-2.5 text-xs text-gray-600">
            {property.features?.bedrooms ? (
              <div className="flex items-center gap-1">
                <Bed size={12} className="text-luximo-600" />
                <span>{property.features.bedrooms}</span>
              </div>
            ) : null}
            {property.features?.bathrooms ? (
              <div className="flex items-center gap-1">
                <Bath size={12} className="text-luximo-600" />
                <span>{property.features.bathrooms}</span>
              </div>
            ) : null}
            {property.features?.area ? (
              <div className="flex items-center gap-1">
                <Square size={12} className="text-luximo-600" />
                <span>{property.features.area}m²</span>
              </div>
            ) : null}
            {property.features.parking && (
              <Car size={12} className="text-luximo-600" />
            )}
            {property.features.garden && (
              <Trees size={12} className="text-luximo-600" />
            )}
          </div>

          {/* Action Buttons - More compact */}
          <div className="flex flex-wrap gap-1">
            {property.media?.infoPackUrl && (
              <button
                onClick={handleInfoPackDownload}
                className="flex items-center gap-1 px-1.5 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <Download size={9} />
                Info
              </button>
            )}
            
            {property.location.mapLink && (
              <button
                onClick={handleLocationClick}
                className="flex items-center gap-1 px-1.5 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors border border-green-200"
              >
                <MapPin size={9} />
                Map
              </button>
            )}
            
            {property.media?.imageUrls && property.media.imageUrls.length > 0 && (
              <button
                onClick={handlePhotoGallery}
                className="flex items-center gap-1 px-1.5 py-1 text-xs bg-amber-50 text-amber-700 rounded hover:bg-amber-100 transition-colors border border-amber-200"
              >
                <Camera size={9} />
                {property.media.imageUrls.length}
              </button>
            )}
          </div>          {/* More Info Buttons - Compact */}
          <div className="space-y-1 mt-auto">
            <button
              onClick={toggleDetails}
              className="w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-luximo-600 text-white rounded hover:bg-luximo-700 transition-colors font-medium text-xs"
            >
              <Info size={12} />
              {showStructuredData ? "Hide Details" : "Details"}
            </button>
            {property.description && (
              <button
                onClick={toggleDescription}
                className="w-full flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors font-medium text-xs"
              >
                <Info size={12} />
                {showDescription ? "Hide Description" : "Description"}
              </button>
            )}
          </div>
        </div>

        {/* Description Section */}
        {showDescription && property.description && (
          <div className="p-2.5 pt-0 border-t border-gray-200 max-h-40 overflow-y-auto">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>
          </div>
        )}

        {/* Structured Data Details */}
        {showStructuredData && (
          <div className="p-2.5 pt-0 border-t border-gray-200 space-y-3 max-h-60 overflow-y-auto">
              {/* Basic Property Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Property Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">ID:</span>
                    <p className="text-gray-700 font-medium">{property.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <p className="text-gray-700 font-medium capitalize">{property.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Price ({property.currency}):</span>
                    <p className="text-gray-700 font-medium">{formatPrice(property.price, property.currency)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Price (EUR):</span>
                    <p className="text-gray-700 font-medium">{formatPrice(property.priceInEUR, 'EUR')}</p>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Location</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">City:</span>
                    <p className="text-gray-700 font-medium">{property.location.city}</p>
                  </div>
                  {property.location.area && (
                    <div>
                      <span className="text-gray-500">Area:</span>
                      <p className="text-gray-700 font-medium">{property.location.area}</p>
                    </div>
                  )}
                  {property.location.address && (
                    <div>
                      <span className="text-gray-500">Address:</span>
                      <p className="text-gray-700 font-medium">{property.location.address}</p>
                    </div>
                  )}
                  {property.location.mapLink && (
                    <div>
                      <span className="text-gray-500">Map Link:</span>
                      <a href={property.location.mapLink} target="_blank" rel="noopener noreferrer" className="text-luximo-600 hover:text-luximo-700 font-medium text-xs break-all">
                        View on Map
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Features */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Features</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {property.features.bedrooms !== undefined && (
                    <div>
                      <span className="text-gray-500">Bedrooms:</span>
                      <p className="text-gray-700 font-medium">{property.features.bedrooms}</p>
                    </div>
                  )}
                  {property.features.bathrooms !== undefined && (
                    <div>
                      <span className="text-gray-500">Bathrooms:</span>
                      <p className="text-gray-700 font-medium">{property.features.bathrooms}</p>
                    </div>
                  )}
                  {property.features.area !== undefined && (
                    <div>
                      <span className="text-gray-500">Area:</span>
                      <p className="text-gray-700 font-medium">{property.features.area} m²</p>
                    </div>
                  )}
                  {property.features.floor !== undefined && (
                    <div>
                      <span className="text-gray-500">Floor:</span>
                      <p className="text-gray-700 font-medium">{property.features.floor}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Parking:</span>
                    <p className="text-gray-700 font-medium">{property.features.parking ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Garden:</span>
                    <p className="text-gray-700 font-medium">{property.features.garden ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Media Information */}
              {property.media && (property.media.imageUrls?.length || property.media.infoPackUrl) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Media</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {property.media.imageUrls && property.media.imageUrls.length > 0 && (
                      <div>
                        <span className="text-gray-500">Images:</span>
                        <p className="text-gray-700 font-medium">{property.media.imageUrls.length} photo(s)</p>
                      </div>
                    )}
                    {property.media.infoPackUrl && (
                      <div>
                        <span className="text-gray-500">Info Pack:</span>
                        <a href={property.media.infoPackUrl} target="_blank" rel="noopener noreferrer" className="text-luximo-600 hover:text-luximo-700 font-medium">
                          Download PDF
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {property.contact && (property.contact.phone || property.contact.email || property.contact.agent) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Contact</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {property.contact.agent && (
                      <div>
                        <span className="text-gray-500">Agent:</span>
                        <p className="text-gray-700 font-medium">{property.contact.agent}</p>
                      </div>
                    )}
                    {property.contact.phone && (
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <a href={`tel:${property.contact.phone}`} className="text-luximo-600 hover:text-luximo-700 font-medium">
                          {property.contact.phone}
                        </a>
                      </div>
                    )}
                    {property.contact.email && (
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <a href={`mailto:${property.contact.email}`} className="text-luximo-600 hover:text-luximo-700 font-medium">
                          {property.contact.email}
                        </a>
                      </div>
                    )}
                  </div>                </div>
              )}
            </div>
          )}
      </div>
    </>
  );
};

export default PropertyCard;
