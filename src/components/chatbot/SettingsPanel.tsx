import { useState } from "react";
import { X, User, Mail, Phone, Building, Euro, Heart, Settings, Save } from "lucide-react";
import { LeadCaptureData } from "./types";
import { Slider } from "@/components/ui/slider";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userData: LeadCaptureData | null;
  onSave: (data: LeadCaptureData) => void;
}

const TRANSACTION_TYPES = [
  { value: "buy", label: "Покупка", icon: Building },
  { value: "rent", label: "Наем", icon: Heart }
];

const BUY_BUDGETS = [
  { value: "under-50k", label: "До €50,000" },
  { value: "50k-100k", label: "€50,000 - €100,000" },
  { value: "100k-150k", label: "€100,000 - €150,000" },
  { value: "150k-200k", label: "€150,000 - €200,000" },
  { value: "200k-300k", label: "€200,000 - €300,000" },
  { value: "300k-500k", label: "€300,000 - €500,000" },
  { value: "500k-plus", label: "€500,000+" }
];

const RENT_BUDGETS = [
  { value: "under-300", label: "До €300/мес" },
  { value: "300-500", label: "€300 - €500/мес" },
  { value: "500-700", label: "€500 - €700/мес" },
  { value: "700-1000", label: "€700 - €1000/мес" },
  { value: "1000-1500", label: "€1000 - €1500/мес" },
  { value: "1500-2000", label: "€1500 - €2000/мес" },
  { value: "2000-plus", label: "€2000+/мес" }
];

const PROPERTY_PREFERENCES = [
  "Студио (1 стая)",
  "1-стаен апартамент", 
  "2-стаен апартамент",
  "3-стаен апартамент",
  "4+ стаен апартамент",
  "Къща",
  "Мезонет",
  "Офис",
  "Магазин"
];

const LOCATION_PREFERENCES = [
  "София - център",
  "София - Витоша", 
  "София - Лозенец",
  "София - Борово",
  "София - Драгалевци",
  "Пловдив",
  "Варна",
  "Бургас",
  "Стара Загора",
  "Друго"
];

export default function SettingsPanel({ 
  isOpen, 
  onClose, 
  userData,
  onSave 
}: SettingsPanelProps) {
  const [formData, setFormData] = useState<Partial<LeadCaptureData>>({
    name: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    transactionType: userData?.transactionType || "",
    budget: userData?.budget || "",
    propertyPreferences: userData?.propertyPreferences || ""
  });
  
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(() => {
    if (userData?.propertyPreferences) {
      return PROPERTY_PREFERENCES.filter(type => 
        userData.propertyPreferences?.includes(type)
      );
    }
    return [];
  });
  
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() => {
    if (userData?.propertyPreferences) {
      return LOCATION_PREFERENCES.filter(location => 
        userData.propertyPreferences?.includes(location)
      );
    }
    return [];
  });
  
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>(() => {
    if (userData?.transactionType) {
      return userData.transactionType.split(",").filter(Boolean);
    }
    return [];
  });
  
  const [customPropertyType, setCustomPropertyType] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 500000]);
  const [useSlider, setUseSlider] = useState(false);
  const [originalData] = useState<LeadCaptureData | null>(userData);

  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if anything has changed
    const allPropertyTypes = [
      ...selectedPropertyTypes,
      ...(customPropertyType ? [customPropertyType] : [])
    ];
    
    const allLocations = [
      ...selectedLocations,
      ...(customLocation ? [customLocation] : [])
    ];
    
    const preferences = [
      ...allPropertyTypes,
      ...allLocations,
      formData.propertyPreferences
    ].filter(Boolean).join(", ");

    const budgetValue = useSlider 
      ? `€${priceRange[0].toLocaleString()} - €${priceRange[1].toLocaleString()}`
      : formData.budget || "";

    const newData: LeadCaptureData = {
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      transactionType: selectedTransactionTypes.join(",") || formData.transactionType || "",
      budget: budgetValue,
      propertyPreferences: preferences
    };
    
    // Check if data has actually changed
    const hasChanged = !originalData || 
      originalData.name !== newData.name ||
      originalData.email !== newData.email ||
      originalData.phone !== newData.phone ||
      originalData.transactionType !== newData.transactionType ||
      originalData.budget !== newData.budget ||
      originalData.propertyPreferences !== newData.propertyPreferences;
    
    if (hasChanged) {
      onSave(newData);
    } else {
      onClose(); // Just close if nothing changed
    }
  };

  const handlePropertyTypeToggle = (type: string) => {
    setSelectedPropertyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handleTransactionTypeToggle = (type: string) => {
    setSelectedTransactionTypes(prev => {
      const newTypes = prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type];
      
      if (newTypes.includes("rent") && !newTypes.includes("buy")) {
        setPriceRange([0, 2000]);
      } else if (newTypes.includes("buy") && !newTypes.includes("rent")) {
        setPriceRange([0, 500000]);
      } else {
        setPriceRange([0, 500000]);
      }
      
      return newTypes;
    });
    setFormData(prev => ({...prev, budget: ""}));
  };

  const budgetOptions = selectedTransactionTypes.includes("rent") ? RENT_BUDGETS : 
                       selectedTransactionTypes.includes("buy") ? BUY_BUDGETS : 
                       formData.transactionType === "rent" ? RENT_BUDGETS : BUY_BUDGETS;  return (
    <div className="absolute inset-0 bg-black/50 flex flex-col z-50 rounded-2xl">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full overflow-hidden flex flex-col">        {/* Header */}
        <div className="bg-gradient-to-r from-luximo-600 to-luximo-700 text-white p-3 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
          <h2 className="text-base font-semibold mb-1">Вашите предпочитания</h2>
          <p className="text-white/90 text-xs">
            Редактирайте вашите предпочитания за по-добри препоръки
          </p>
        </div>        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* Personal Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <User size={16} />
              <span className="font-medium">Лични данни</span>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Вашето име"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
              />
              <input
                type="email"
                placeholder="Email адрес"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
              />
              <input
                type="tel"
                placeholder="Телефон (незадължително)"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
              />
            </div>
          </div>

          {/* Transaction Type */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700 mb-3">              <Building size={16} />
              <span className="font-medium">Тип сделка</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {TRANSACTION_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleTransactionTypeToggle(value)}
                  className={`p-3 border-2 rounded-lg transition-all flex flex-col items-center gap-2 ${
                    selectedTransactionTypes.includes(value)
                      ? 'border-luximo-500 bg-luximo-50 text-luximo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          {(selectedTransactionTypes.length > 0 || formData.transactionType) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <Euro size={16} />
                <span className="font-medium">Бюджет</span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setUseSlider(false)}
                  className={`px-2 py-1 text-xs rounded-lg transition-all ${
                    !useSlider 
                      ? 'bg-luximo-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Списък
                </button>
                <button
                  type="button"
                  onClick={() => setUseSlider(true)}
                  className={`px-2 py-1 text-xs rounded-lg transition-all ${
                    useSlider 
                      ? 'bg-luximo-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Обхват
                </button>
              </div>

              {!useSlider ? (
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({...prev, budget: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm bg-white cursor-pointer"
                >
                  <option value="">Изберете бюджет</option>
                  {budgetOptions.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={selectedTransactionTypes.includes("rent") ? 3000 : 1000000}
                    min={0}
                    step={selectedTransactionTypes.includes("rent") ? 50 : 5000}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}          {/* Property Preferences */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <Heart size={16} />
              <span className="font-medium">Предпочитания</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Тип имот:</p>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_PREFERENCES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handlePropertyTypeToggle(type)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        selectedPropertyTypes.includes(type)
                          ? 'bg-luximo-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Друг тип..."
                  value={customPropertyType}
                  onChange={(e) => setCustomPropertyType(e.target.value)}
                  className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Локации:</p>
                <div className="flex flex-wrap gap-2">
                  {LOCATION_PREFERENCES.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => handleLocationToggle(location)}                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        selectedLocations.includes(location)
                          ? 'bg-luximo-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Друга локация..."
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
                />
              </div>
              
              <textarea
                placeholder="Допълнителни предпочитания..."
                value={formData.propertyPreferences}
                onChange={(e) => setFormData(prev => ({...prev, propertyPreferences: e.target.value}))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm resize-none"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Отказ
            </button>            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-luximo-600 text-white rounded-lg hover:bg-luximo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Запази
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
