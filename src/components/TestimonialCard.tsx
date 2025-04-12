
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  companyName: string;
}

const TestimonialCard = ({ quote, name, title, companyName }: TestimonialCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-4 text-luximo-600">
        <Quote size={32} />
      </div>
      <p className="text-gray-700 mb-6 italic">{quote}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          <span className="text-gray-600 font-medium">{name[0]}</span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{title}, {companyName}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
