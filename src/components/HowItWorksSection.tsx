
import { MessageSquare, Search, UserCheck } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Как работи Luximo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Просто интегрирайте нашия чат бот във вашия сайт и оставете Luximo да 
            се погрижи за вашите потенциални клиенти
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-luximo-100 flex items-center justify-center mb-6">
                <MessageSquare className="text-luximo-600" size={28} />
              </div>
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-luximo-400 to-transparent"></div>
              
              <div className="w-10 h-10 rounded-full bg-luximo-600 text-white flex items-center justify-center mb-4">
                <span className="font-bold">1</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Клиент пише запитване</h3>
              <p className="text-gray-600 text-center">
                Посетителят въвежда своите предпочитания и критерии за търсене на имот 
                в естествен език
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-luximo-100 flex items-center justify-center mb-6">
                <Search className="text-luximo-600" size={28} />
              </div>
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-luximo-400 to-transparent"></div>
              
              <div className="w-10 h-10 rounded-full bg-luximo-600 text-white flex items-center justify-center mb-4">
                <span className="font-bold">2</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Luximo намира подходящи имоти</h3>
              <p className="text-gray-600 text-center">
                AI анализира запитването, извлича параметри и търси в базата данни 
                най-подходящите предложения
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-luximo-100 flex items-center justify-center mb-6">
                <UserCheck className="text-luximo-600" size={28} />
              </div>
              
              <div className="w-10 h-10 rounded-full bg-luximo-600 text-white flex items-center justify-center mb-4">
                <span className="font-bold">3</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800 text-center">Предлага резултати + събира данни</h3>
              <p className="text-gray-600 text-center">
                Чатботът показва подходящите имоти и деликатно събира контактна информация 
                за последващ контакт от брокер
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
