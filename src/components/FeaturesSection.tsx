
import FeatureCard from "./FeatureCard";
import { MessageSquare, Filter, Database, FileInput } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Интелигентна комуникация за имотни агенции
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Luximo използва най-модерните технологии за изкуствен интелект, за да превърне посетителите на вашия сайт в клиенти
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="Пълно разбиране на български език"
            description="Естествена комуникация с потребителите на родния им език, разбиране на нюанси и диалекти."
            icon={MessageSquare}
          />
          <FeatureCard
            title="Интелигентно филтриране"
            description="Автоматично извличане на критерии като локация, бюджет, квадратура и екстри от свободен текст."
            icon={Filter}
          />
          <FeatureCard
            title="Интеграция с бази данни"
            description="Свързване с вашата съществуваща имотна база и показване на релевантни резултати в реално време."
            icon={Database}
          />
          <FeatureCard
            title="Генериране на запитвания"
            description="Автоматично събиране на контактна информация и изпращане на структурирани запитвания до брокерите."
            icon={FileInput}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
