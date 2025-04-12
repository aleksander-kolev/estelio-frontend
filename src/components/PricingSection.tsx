
import PricingCard from "./PricingCard";

const PricingSection = () => {
  return (
    <section id="pricing" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Изберете план, подходящ за вашия бизнес
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Достъпни цени за всеки размер агенция, с възможност за мащабиране според нуждите ви
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <PricingCard
            title="Стартов"
            price="149 лв"
            description="Идеален за малки агенции или индивидуални брокери"
            features={[
              "До 100 чат сесии месечно",
              "Интеграция с 1 уебсайт",
              "Базови филтри за търсене на имоти",
              "Имейл известия за нови запитвания",
              "Стандартна поддръжка"
            ]}
            ctaText="Започнете сега"
          />

          {/* Professional Plan */}
          <PricingCard
            title="Професионален"
            price="249 лв"
            description="За разрастващи се агенции с активен уебсайт"
            features={[
              "До 500 чат сесии месечно",
              "Интеграция с до 3 уебсайта",
              "Разширени филтри и персонализация",
              "Интеграция с CRM системи",
              "Приоритетна поддръжка",
              "Персонализирани отговори с лого"
            ]}
            isPopular={true}
            ctaText="Изберете този план"
          />

          {/* Enterprise Plan */}
          <PricingCard
            title="Корпоративен"
            price="По договаряне"
            description="За големи агенции с комплексни нужди"
            features={[
              "Неограничен брой чат сесии",
              "Интеграция с множество платформи",
              "Пълна персонализация на отговорите",
              "Интеграция с всички ваши системи",
              "VIP поддръжка с личен мениджър",
              "Аналитични доклади и статистика"
            ]}
            ctaText="Свържете се с нас"
          />
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Нуждаете се от персонализирано решение? <a href="#" className="text-luximo-600 font-medium">Свържете се с нашия отдел продажби</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
