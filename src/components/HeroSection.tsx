
import { Button } from "@/components/ui/button";
import ChatbotDemo from "./ChatbotDemo";
import { MessageSquare, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden gradient-bg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-luximo-100 text-luximo-800 text-sm font-medium">
              <MessageSquare size={16} /> 
              <span>ИИ асистент за имоти</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              AI агент за недвижими имоти – 24/7 виртуален консултант за вашите клиенти
            </h1>
            <p className="text-xl text-gray-600">
              ImotAI автоматично отговаря на въпроси, предлага имоти и генерира качествени запитвания
            </p>
            <p className="text-md text-gray-600 italic">
              „Край на безкрайното скролване – ImotAI намира точния имот за секунди."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" className="bg-luximo-600 hover:bg-luximo-700 text-white">
                Вижте демо
              </Button>
              <Button size="lg" variant="outline" className="border-luximo-600 text-luximo-600 hover:bg-luximo-50">
                Свържете се с нас <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
              <div className="flex items-center">
                <svg className="h-4 w-4 text-luximo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1">Без първоначална такса</span>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 text-luximo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1">14 дни безплатен тест</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center md:justify-end animate-float">
            <ChatbotDemo />
          </div>
        </div>
      </div>

      {/* Design elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-luximo-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-luximo-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
    </section>
  );
};

export default HeroSection;
