
import { Clock, UserMinus, TrendingUp, Users } from "lucide-react";

const BenefitsSection = () => {
  return (
    <section id="benefits" className="section-padding gradient-bg">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Ползи за имотните агенции
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Вижте как Luximo може да трансформира вашия бизнес и да увеличи продажбите ви
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Benefit 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-luximo-100 flex items-center justify-center mb-4">
              <Clock className="text-luximo-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Обслужване 24/7</h3>
            <p className="text-gray-600">
              Никога не пропускайте потенциален клиент, дори извън работно време, 
              през почивните дни или по празниците
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-luximo-100 flex items-center justify-center mb-4">
              <UserMinus className="text-luximo-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">По-малко натоварване</h3>
            <p className="text-gray-600">
              Освободете брокерите от рутинни запитвания и им позволете да се фокусират върху 
              квалифицирани клиенти
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-luximo-100 flex items-center justify-center mb-4">
              <TrendingUp className="text-luximo-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Повече конверсии</h3>
            <p className="text-gray-600">
              Мигновените отговори и персонализираните препоръки увеличават 
              конверсията на потенциалните клиенти
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-luximo-100 flex items-center justify-center mb-4">
              <Users className="text-luximo-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Без пропуснати клиенти</h3>
            <p className="text-gray-600">
              Елиминирайте риска от пропуснати запитвания чрез автоматизирана система 
              за проследяване и уведомяване
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
