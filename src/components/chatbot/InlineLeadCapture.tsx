import { Bot } from "lucide-react";
import { LeadCaptureData } from "./types";

interface InlineLeadCaptureProps {
  pendingMessage: string;
  onPendingMessageChange: (message: string) => void;
  onSubmit: (data: LeadCaptureData) => void;
  onSkip: () => void;
}

export default function InlineLeadCapture({ 
  pendingMessage, 
  onPendingMessageChange, 
  onSubmit, 
  onSkip 
}: InlineLeadCaptureProps) {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-2 max-w-[95%] w-full">
        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
          <Bot size={16} />
        </div>
        <div className="bg-gray-100 rounded-lg p-3 w-full">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-800 mb-2">
              За да ви помогна по-добре, моля споделете малко информация:
            </p>
            <div className="bg-white p-2 rounded border">
              <p className="text-xs text-gray-600 mb-1">Вашето запитване:</p>
              <textarea
                value={pendingMessage}
                onChange={(e) => onPendingMessageChange(e.target.value)}
                className="w-full text-xs text-gray-800 bg-transparent border-none outline-none resize-none"
                rows={2}
                placeholder="Редактирайте вашето запитване..."
              />
            </div>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data = {
              name: formData.get('name') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
              transactionType: formData.get('transactionType') as string,
              budget: formData.get('budget') as string,
              propertyPreferences: formData.get('preferences') as string
            };
            onSubmit(data);
          }} className="space-y-3">
            
            <div className="grid grid-cols-2 gap-2">
              <input
                name="name"
                type="text"
                placeholder="Име *"
                required
                className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-luximo-500"
              />
              <input
                name="email"
                type="email"
                placeholder="Email *"
                required
                className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-luximo-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <input
                name="phone"
                type="tel"
                placeholder="Телефон"
                className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-luximo-500"
              />
              <select
                name="transactionType"
                required
                defaultValue=""
                className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-luximo-500 bg-white appearance-none cursor-pointer"
                style={{ minHeight: '24px' }}
                onChange={(e) => {
                  const budgetSelect = e.target.form?.querySelector('select[name="budget"]') as HTMLSelectElement;
                  if (budgetSelect) {
                    budgetSelect.innerHTML = e.target.value === 'rent' 
                      ? `<option value="">Бюджет наем *</option>
                         <option value="under-300">До €300/мес</option>
                         <option value="300-500">€300 - €500/мес</option>
                         <option value="500-700">€500 - €700/мес</option>
                         <option value="700-1000">€700 - €1000/мес</option>
                         <option value="1000-1500">€1000 - €1500/мес</option>
                         <option value="1500-2000">€1500 - €2000/мес</option>
                         <option value="2000-plus">€2000+/мес</option>`
                      : `<option value="">Бюджет покупка *</option>
                         <option value="under-50k">До €50,000</option>
                         <option value="50k-100k">€50,000 - €100,000</option>
                         <option value="100k-150k">€100,000 - €150,000</option>
                         <option value="150k-200k">€150,000 - €200,000</option>
                         <option value="200k-300k">€200,000 - €300,000</option>
                         <option value="300k-500k">€300,000 - €500,000</option>
                         <option value="500k-plus">€500,000+</option>`;
                    budgetSelect.value = '';
                  }
                }}
              >
                <option value="" disabled>Тип сделка *</option>
                <option value="buy">Покупка</option>
                <option value="rent">Наем</option>
              </select>
            </div>
            
            <select
              name="budget"
              required
              defaultValue=""
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-luximo-500 bg-white appearance-none cursor-pointer"
              style={{ minHeight: '24px' }}
            >
              <option value="" disabled>Първо изберете тип сделка</option>
            </select>
            
            <textarea
              name="preferences"
              placeholder="Предпочитания (брой стаи, район, др.) *"
              required
              rows={2}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-luximo-500 resize-none"
            />
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onSkip}
                className="flex-1 px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors"
              >
                Пропусни
              </button>
              <button
                type="submit"
                className="flex-1 px-3 py-1 bg-luximo-600 text-white rounded text-xs hover:bg-luximo-700 transition-colors"
              >
                Продължи
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
