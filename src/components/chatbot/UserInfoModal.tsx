import { useState } from "react";
import { X, User, Mail, Phone, Building, Euro, Heart, Settings, Plus } from "lucide-react";
import { LeadCaptureData } from "./types";
import { Slider } from "@/components/ui/slider";

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip?: () => void;
  onSubmit: (data: LeadCaptureData) => void;
  pendingMessage?: string;
  initialData?: Partial<LeadCaptureData>;
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

export default function UserInfoModal({ 
  isOpen, 
  onClose, 
  onSkip,
  onSubmit, 
  pendingMessage,
  initialData 
}: UserInfoModalProps) {
  const [formData, setFormData] = useState<Partial<LeadCaptureData>>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    transactionType: initialData?.transactionType || "",
    budget: initialData?.budget || "",
    propertyPreferences: initialData?.propertyPreferences || ""
  });
    const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(() => {
    // Initialize from existing preferences if editing
    if (initialData?.propertyPreferences) {
      return PROPERTY_PREFERENCES.filter(type => 
        initialData.propertyPreferences?.includes(type)
      );
    }
    return [];
  });
  
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() => {
    // Initialize from existing preferences if editing
    if (initialData?.propertyPreferences) {
      return LOCATION_PREFERENCES.filter(location => 
        initialData.propertyPreferences?.includes(location)
      );
    }
    return [];
  });
    const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>(() => {
    if (initialData?.transactionType) {
      return [initialData.transactionType];
    }
    return [];
  });

  const [customPropertyType, setCustomPropertyType] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 500000]);
  const [useSlider, setUseSlider] = useState(false);
  const [addedCustomPropertyTypes, setAddedCustomPropertyTypes] = useState<string[]>([]);
  const [addedCustomLocations, setAddedCustomLocations] = useState<string[]>([]);
  const [customAdditionalInfo, setCustomAdditionalInfo] = useState("");
  const [addedAdditionalInfo, setAddedAdditionalInfo] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      // Combine manual preferences with selected checkboxes and custom inputs
    const allPropertyTypes = [
      ...selectedPropertyTypes,
      ...addedCustomPropertyTypes
    ];
    
    const allLocations = [
      ...selectedLocations,
      ...addedCustomLocations
    ];
    
    const allAdditionalInfo = [
      ...addedAdditionalInfo,
      formData.propertyPreferences
    ].filter(Boolean);
    
    const preferences = [
      ...allPropertyTypes,
      ...allLocations,
      ...allAdditionalInfo
    ].filter(Boolean).join(", ");

    // Determine budget value
    const budgetValue = useSlider 
      ? `€${priceRange[0].toLocaleString()} - €${priceRange[1].toLocaleString()}`
      : formData.budget || "";

    const data: LeadCaptureData = {
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      transactionType: selectedTransactionTypes.join(",") || formData.transactionType || "",
      budget: budgetValue,
      propertyPreferences: preferences
    };
    
    onSubmit(data);
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
      
      // Reset price range when transaction type changes
      if (newTypes.includes("rent") && !newTypes.includes("buy")) {
        setPriceRange([0, 2000]);
      } else if (newTypes.includes("buy") && !newTypes.includes("rent")) {
        setPriceRange([0, 500000]);
      } else {
        setPriceRange([0, 500000]);
      }
      
      return newTypes;
    });    // Clear budget when transaction type changes
    setFormData(prev => ({...prev, budget: ""}));
  };

  // Custom property and location handlers
  const handleAddCustomPropertyType = () => {
    if (customPropertyType.trim() && !addedCustomPropertyTypes.includes(customPropertyType.trim())) {
      setAddedCustomPropertyTypes(prev => [...prev, customPropertyType.trim()]);
      setCustomPropertyType("");
    }
  };

  const handleAddCustomLocation = () => {
    if (customLocation.trim() && !addedCustomLocations.includes(customLocation.trim())) {
      setAddedCustomLocations(prev => [...prev, customLocation.trim()]);
      setCustomLocation("");
    }
  };

  const handleAddCustomAdditionalInfo = () => {
    if (customAdditionalInfo.trim() && !addedAdditionalInfo.includes(customAdditionalInfo.trim())) {
      setAddedAdditionalInfo(prev => [...prev, customAdditionalInfo.trim()]);
      setCustomAdditionalInfo("");
    }
  };

  const handleRemoveCustomPropertyType = (type: string) => {
    setAddedCustomPropertyTypes(prev => prev.filter(t => t !== type));
  };

  const handleRemoveCustomLocation = (location: string) => {
    setAddedCustomLocations(prev => prev.filter(l => l !== location));
  };

  const handleRemoveCustomAdditionalInfo = (info: string) => {
    setAddedAdditionalInfo(prev => prev.filter(i => i !== info));
  };

  const handleCustomPropertyKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomPropertyType();
    }
  };

  const handleCustomLocationKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomLocation();
    }
  };

  const handleCustomAdditionalInfoKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomAdditionalInfo();
    }
  };

  const budgetOptions = selectedTransactionTypes.includes("rent") ? RENT_BUDGETS : 
                       selectedTransactionTypes.includes("buy") ? BUY_BUDGETS : 
                       formData.transactionType === "rent" ? RENT_BUDGETS : BUY_BUDGETS;  return (
    <div className="absolute inset-0 bg-black/50 flex flex-col z-50 rounded-2xl">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-luximo-600 to-luximo-700 text-white p-3 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
          <h2 className="text-base font-semibold mb-1">Вашите предпочитания</h2>
          <p className="text-white/90 text-xs">
            Споделете малко информация, за да ви помогна по-добре
          </p>
        </div>        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1" autoComplete="on">
          {/* Personal Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <User size={16} />
              <span className="font-medium">Лични данни</span>
            </div>
              <div className="space-y-3">
              <input
                type="text"
                name="fullName"
                placeholder="Вашето име"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                autoComplete="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
              />
              <input
                type="email"
                name="email"
                placeholder="Email адрес"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                autoComplete="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Телефон (незадължително)"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                autoComplete="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm"
              /></div>
          </div>

          {/* Transaction Type */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <Building size={16} />
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
              ))}            </div>
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
                  className={`px-3 py-1 text-xs rounded-lg transition-all ${
                    !useSlider 
                      ? 'bg-luximo-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Избор от списък
                </button>
                <button
                  type="button"
                  onClick={() => setUseSlider(true)}
                  className={`px-3 py-1 text-xs rounded-lg transition-all ${
                    useSlider 
                      ? 'bg-luximo-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ценови обхват
                </button>
              </div>

              {!useSlider ? (
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({...prev, budget: e.target.value}))}
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    backgroundSize: '12px',
                    paddingRight: '32px'
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-sm bg-white cursor-pointer"
                >
                  <option value="">Изберете бюджет</option>
                  {budgetOptions.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Ценови обхват: €{priceRange[0].toLocaleString()} - €{priceRange[1].toLocaleString()}
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={selectedTransactionTypes.includes("rent") ? 3000 : 1000000}
                    min={0}
                    step={selectedTransactionTypes.includes("rent") ? 50 : 5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>€0</span>
                    <span>€{selectedTransactionTypes.includes("rent") ? "3,000" : "1,000,000"}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Property Preferences */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              <Heart size={16} />
              <span className="font-medium">Предпочитания за имот</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">Тип имот:</p>                <div className="flex flex-wrap gap-2">
                  {PROPERTY_PREFERENCES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handlePropertyTypeToggle(type)}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        selectedPropertyTypes.includes(type)
                          ? 'bg-luximo-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                  {/* Custom added property types */}
                  {addedCustomPropertyTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleRemoveCustomPropertyType(type)}
                      className="px-3 py-1 rounded-full text-xs transition-all bg-green-500 text-white hover:bg-red-500"
                      title="Натиснете за премахване"
                    >
                      {type} ×
                    </button>
                  ))}
                </div>
                
                <div className="relative mt-2">
                  <input
                    type="text"
                    placeholder="Друг тип имот..."
                    value={customPropertyType}
                    onChange={(e) => setCustomPropertyType(e.target.value)}
                    onKeyPress={handleCustomPropertyKeyPress}
                    className="w-full px-3 py-1 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomPropertyType}
                    disabled={!customPropertyType.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-luximo-500 hover:text-luximo-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
                <div>
                <p className="text-sm text-gray-600 mb-2">Предпочитани локации:</p>
                <div className="flex flex-wrap gap-2">
                  {LOCATION_PREFERENCES.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => handleLocationToggle(location)}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        selectedLocations.includes(location)
                          ? 'bg-luximo-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                  {/* Custom added locations */}
                  {addedCustomLocations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => handleRemoveCustomLocation(location)}
                      className="px-3 py-1 rounded-full text-xs transition-all bg-green-500 text-white hover:bg-red-500"
                      title="Натиснете за премахване"
                    >
                      {location} ×
                    </button>
                  ))}
                </div>
                
                <div className="relative mt-2">
                  <input
                    type="text"
                    placeholder="Друга локация..."
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    onKeyPress={handleCustomLocationKeyPress}
                    className="w-full px-3 py-1 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomLocation}
                    disabled={!customLocation.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-luximo-500 hover:text-luximo-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus size={16} />
                  </button>                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Допълнителни предпочитания:</p>
                <div className="flex flex-wrap gap-2">
                  {addedAdditionalInfo.map((info) => (
                    <button
                      key={info}
                      type="button"
                      onClick={() => handleRemoveCustomAdditionalInfo(info)}
                      className="px-3 py-1 rounded-full text-xs transition-all bg-green-500 text-white hover:bg-red-500"
                      title="Натиснете за премахване"
                    >
                      {info} ×
                    </button>
                  ))}
                </div>
                
                <div className="relative mt-2">
                  <input
                    type="text"
                    placeholder="Допълнителни предпочитания (например: с паркомясто, тераса, ново строителство)"
                    value={customAdditionalInfo}
                    onChange={(e) => setCustomAdditionalInfo(e.target.value)}
                    onKeyPress={handleCustomAdditionalInfoKeyPress}
                    className="w-full px-3 py-1 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luximo-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAdditionalInfo}
                    disabled={!customAdditionalInfo.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-luximo-500 hover:text-luximo-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">            <button
              type="button"
              onClick={onSkip || onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Пропусни
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-luximo-600 text-white rounded-lg hover:bg-luximo-700 transition-colors text-sm font-medium"
            >
              Продължи
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
