
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FeatureCard = ({ title, description, icon: Icon }: FeatureCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-luximo-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-luximo-100 flex items-center justify-center mb-4">
        <Icon className="text-luximo-600" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
