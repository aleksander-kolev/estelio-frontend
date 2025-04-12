
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  return (
    <section id="faq" className="section-padding">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Често задавани въпроси
          </h2>
          <p className="text-xl text-gray-600">
            Отговори на най-често задаваните въпроси относно Luximo
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg px-6">
            <AccordionTrigger className="text-lg text-left py-4">
              Колко време отнема интегрирането на Luximo към нашия сайт?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-4">
              Интегрирането на Luximo е много бързо и отнема от 1 до 3 работни дни, в зависимост от 
              сложността на вашия уебсайт. Нашият технически екип ще направи цялата интеграция, 
              така че не са необходими специални технически познания от ваша страна.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg px-6">
            <AccordionTrigger className="text-lg text-left py-4">
              Какво се случва, когато чатботът не може да отговори на въпрос?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-4">
              В редките случаи, когато Luximo не може да предостави подходящ отговор, чатботът 
              деликатно прехвърля разговора към човек от вашия екип или събира контактна информация, 
              за да може ваш представител да се свърже с клиента. Всеки такъв случай се използва за 
              допълнително обучение и подобряване на системата.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg px-6">
            <AccordionTrigger className="text-lg text-left py-4">
              Как се интегрира Luximo с нашата съществуваща база данни с имоти?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-4">
              Luximo предлага гъвкави интеграционни възможности. Можем да интегрираме системата 
              с повечето популярни CRM системи и бази данни чрез API. Също така поддържаме импортиране 
              на данни от Excel, XML и други формати. По време на внедряването, нашият екип ще 
              анализира вашата система и ще предложи най-добрия подход за интеграция.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg px-6">
            <AccordionTrigger className="text-lg text-left py-4">
              Необходимо ли е да променяме нашия уебсайт, за да работи с Luximo?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-4">
              Не, Luximo е проектиран да се интегрира безпроблемно с вашия съществуващ уебсайт 
              без необходимост от значителни промени. Чатботът се добавя като плаващ бутон или 
              закотвен прозорец, който може да бъде персонализиран според дизайна на вашия сайт. 
              Нашата цел е да подобрим вашето потребителско изживяване, без да нарушаваме 
              съществуващата ви онлайн присъствие.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Имате въпрос, който не е включен? <a href="#" className="text-luximo-600 font-medium">Свържете се с нашия отдел обслужване на клиенти</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
