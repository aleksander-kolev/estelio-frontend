
import TestimonialCard from "./TestimonialCard";

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-luximo-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Клиентите споделят за нас
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Вижте какво казват имотните агенции, които вече използват Luximo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            quote="След като интегрирахме Luximo в нашия сайт, отчетохме 40% повече запитвания от потенциални клиенти. Чатботът помага на посетителите да намират точно каквото търсят."
            name="Мария Иванова"
            title="Управител"
            companyName="Sofia Premier Estates"
          />
          <TestimonialCard
            quote="Най-впечатляващото за нас е, че Luximo наистина разбира българския език и нюансите в запитванията. Клиентите често споделят колко естествено се чувства комуникацията."
            name="Георги Петров"
            title="Маркетинг директор"
            companyName="Luxury Home Bulgaria"
          />
          <TestimonialCard
            quote="Нашите брокери вече не губят време в отговаряне на базови въпроси. Luximo предварително филтрира и квалифицира клиентите, което прави работата ни много по-ефективна."
            name="Никола Димитров"
            title="Главен брокер"
            companyName="Property Vision Group"
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
