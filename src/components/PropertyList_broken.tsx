import PropertyCard, { PropertyResult } from './PropertyCard';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';

interface PropertyListProps {
  properties: PropertyResult[];
  isPropertyInfo?: boolean;
  onOpenGallery?: (property: PropertyResult, imageIndex: number) => void;
}

const PropertyList = ({ properties, isPropertyInfo = false, onOpenGallery }: PropertyListProps) => {
  // Debug logging
  console.log('🏡 PropertyList called with:', {
    propertiesCount: properties?.length || 0,
    properties: properties,
    isPropertyInfo
  });
    const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);  // State for synchronized expansion
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  
  // Limit properties to maximum 20 for performance
  const MAX_PROPERTIES = 20;
  const visibleProperties = properties.slice(0, MAX_PROPERTIES);
  };
  // Handlers for synchronized expansion - use visibleProperties instead of properties
  const handleToggleDetails = useCallback((propertyId: string) => {
    setExpandedDetails(prev => {
      const newSet = new Set<string>();
      if (!prev.has(propertyId)) {
        // If expanding, expand all visible properties and close descriptions
        visibleProperties.forEach(p => newSet.add(p.id));
        setExpandedDescriptions(new Set());
      }
      // If collapsing, collapse all (newSet remains empty)
      return newSet;
    });
  }, [visibleProperties]);

  const handleToggleDescription = useCallback((propertyId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set<string>();
      if (!prev.has(propertyId)) {
        // If expanding, expand all visible properties and close details
        visibleProperties.forEach(p => newSet.add(p.id));
        setExpandedDetails(new Set());
      }
      // If collapsing, collapse all (newSet remains empty)
      return newSet;
    });
  }, [visibleProperties]);
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };  // Mouse drag functionality - simplified
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollStart(scrollContainerRef.current?.scrollLeft || 0);
    e.preventDefault();
  }, []);  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.clientX;
    const walk = (startX - x) * 0.5; // Even more sensitive - less multiplier
    scrollContainerRef.current.scrollLeft = scrollStart + walk;
  }, [isDragging, startX, scrollStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    snapToNearestCard();
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      snapToNearestCard();
    }
  }, [isDragging]);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  // Touch functionality - simplified
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setScrollStart(scrollContainerRef.current?.scrollLeft || 0);
  }, []);  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.touches[0].clientX;
    const walk = (startX - x) * 0.5; // Even more sensitive - less multiplier
    scrollContainerRef.current.scrollLeft = scrollStart + walk;
  }, [isDragging, startX, scrollStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    snapToNearestCard();
  }, []);
  // Snap to nearest card
  const snapToNearestCard = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('[data-property-card]')?.clientWidth || 256; // Default to w-64 (256px)
    const gap = 16; // Gap between cards
    const cardWithGap = cardWidth + gap;
    
    const scrollPosition = container.scrollLeft;
    const nearestCard = Math.round(scrollPosition / cardWithGap);
    const targetPosition = nearestCard * cardWithGap;
    
    container.scrollTo({
      left: targetPosition,
      behavior: 'smooth'
    });  }, []);

  // Reset pagination when properties change
  useEffect(() => {
    setCurrentPage(0);
    setExpandedDetails(new Set());
    setExpandedDescriptions(new Set());
  }, [properties]);

  useEffect(() => {
    checkScrollButtons();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      return () => scrollContainer.removeEventListener('scroll', checkScrollButtons);
    }
  }, [properties]);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !scrollContainerRef.current) return;
      e.preventDefault();
      const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0);
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollStart - walk;
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        snapToNearestCard();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, startX, scrollStart, snapToNearestCard]);

  useEffect(() => {
    // Check if we should show scroll to bottom button
    const handleScroll = () => {
      const chatContainer = document.querySelector('[data-chat-container]');
      if (chatContainer) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollToBottom(!isNearBottom);
      }
    };

    const chatContainer = document.querySelector('[data-chat-container]');
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToBottom = () => {
    const chatContainer = document.querySelector('[data-chat-container]');
    if (chatContainer) {
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  };  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('[data-property-card]')?.clientWidth || 256;
      const gap = 16;
      const cardWithGap = cardWidth + gap;
      
      const currentPosition = container.scrollLeft;
      const currentCard = Math.floor(currentPosition / cardWithGap);
      const targetPosition = Math.max(0, (currentCard - 1) * cardWithGap);
      
      container.scrollTo({
        left: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('[data-property-card]')?.clientWidth || 256;
      const gap = 16;
      const cardWithGap = cardWidth + gap;
      
      const currentPosition = container.scrollLeft;
      const currentCard = Math.floor(currentPosition / cardWithGap);
      const maxCards = Math.floor((container.scrollWidth - container.clientWidth) / cardWithGap) + 1;
      const targetPosition = Math.min(maxCards * cardWithGap, (currentCard + 1) * cardWithGap);
      
      container.scrollTo({
        left: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className="relative">      {/* Scroll to Bottom Button */}
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-6 right-6 z-50 bg-luximo-600 text-white p-3 rounded-full shadow-lg hover:bg-luximo-700 transition-all transform hover:scale-105"
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={20} />
        </button>
      )}      {/* Header with count and navigation */}
      {properties.length > 1 && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {isPropertyInfo ? 'Property Details' : `Found ${properties.length} Properties`}
          </h3>
            {visibleProperties.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {hasMorePages && (
        <div className="flex items-center justify-between mb-4 px-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Previous</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <span className="text-xs text-gray-500">
              ({startIndex + 1}-{endIndex} of {properties.length})
            </span>
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm font-medium text-gray-700">Next</span>
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      )}{/* Properties container */}
      <div className="relative overflow-hidden" data-property-list>        <div
          ref={scrollContainerRef}
          className={`flex gap-4 overflow-x-auto scrollbar-hide pb-2 ${
            visibleProperties.length === 1 ? 'justify-start' : ''
          } ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab snap-x snap-mandatory'}`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: isDragging ? 'none' : 'x mandatory',
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >          {visibleProperties.map((property) => (
            <div key={property.id} className="snap-start flex-shrink-0 w-64 sm:w-72">              <PropertyCard
                property={property}
                isPropertyInfo={isPropertyInfo}
                showStructuredData={expandedDetails.has(property.id)}
                showDescription={expandedDescriptions.has(property.id)}
                onToggleDetails={handleToggleDetails}
                onToggleDescription={handleToggleDescription}
                onOpenGallery={onOpenGallery}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
