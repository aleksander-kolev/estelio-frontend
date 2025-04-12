
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">Luximo</h3>
            <p className="mb-4">
              AI асистент за недвижими имоти, който помага на агенциите да обслужват клиенти 24/7 и да увеличат своите продажби.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">Полезни връзки</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Начало</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Функции</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Цени</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">ЧЗВ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Блог</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">Контакти</h4>
            <ul className="space-y-2">
              <li>София, ул. "Шипченски проход" 63</li>
              <li>+359 2 888 1234</li>
              <li>info@luximo.bg</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">Абонирайте се</h4>
            <p className="mb-4">Получавайте актуални новини и съвети за имотния пазар</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Вашият имейл"
                className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-luximo-500 flex-grow"
              />
              <Button className="bg-luximo-600 hover:bg-luximo-700">Изпрати</Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} Luximo. Всички права запазени.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Условия за ползване</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Политика за поверителност</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Бисквитки</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
