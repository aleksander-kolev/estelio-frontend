interface QuickRepliesProps {
  replies: string[];
  onReplySelect: (reply: string) => void;
  isVisible: boolean;
}

export default function QuickReplies({ replies, onReplySelect, isVisible }: QuickRepliesProps) {
  if (!isVisible || replies.length === 0) return null;  return (
    <div className="border-t border-gray-100 bg-white/95 backdrop-blur-sm p-2">
      <div 
        className="flex gap-2 overflow-x-auto pb-1 quick-replies-scroll" 
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {replies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onReplySelect(reply)}
            className="flex-shrink-0 px-3 py-1.5 text-xs bg-gradient-to-r from-luximo-50 to-luximo-100 border border-luximo-200 rounded-lg hover:from-luximo-100 hover:to-luximo-200 hover:border-luximo-300 hover:shadow-sm transition-all duration-200 text-luximo-700 font-medium whitespace-nowrap"
            style={{ scrollSnapAlign: 'start' }}
          >
            {reply}
          </button>
        ))}
      </div>
        <style>{`
        .quick-replies-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.2) transparent;
        }
        
        .quick-replies-scroll::-webkit-scrollbar {
          height: 3px;
        }
        
        .quick-replies-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .quick-replies-scroll::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.25);
          border-radius: 1.5px;
        }
        
        .quick-replies-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.4);
        }
        
        .quick-replies-scroll::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
