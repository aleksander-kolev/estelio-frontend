import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled: boolean;
  placeholder: string;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onKeyPress, 
  disabled, 
  placeholder 
}: ChatInputProps) {
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 focus:border-transparent text-sm"
          disabled={disabled}
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="bg-luximo-600 text-white p-2 rounded-lg hover:bg-luximo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
