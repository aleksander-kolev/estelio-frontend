
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  ctaText,
}: PricingCardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border ${
      isPopular ? "border-luximo-500 shadow-lg" : "border-gray-200"
    } p-8 relative flex flex-col h-full`}>
      {isPopular && (
        <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-luximo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
          Препоръчан
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-end mb-1">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          <span className="text-gray-600 ml-2 mb-1">/месец</span>
        </div>
        <p className="text-sm text-gray-500">Заплаща се на годишна база</p>
      </div>

      <div className="flex-grow">
        <ul className="space-y-3 my-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check size={18} className="text-luximo-600 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        className={`mt-6 w-full ${
          isPopular
            ? "bg-luximo-600 hover:bg-luximo-700 text-white"
            : "bg-white hover:bg-gray-50 text-luximo-600 border border-luximo-600"
        }`}
        variant={isPopular ? "default" : "outline"}
      >
        {ctaText}
      </Button>
    </div>
  );
};

export default PricingCard;
