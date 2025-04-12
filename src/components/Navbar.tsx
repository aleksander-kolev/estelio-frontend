
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between">
        <a href="#" className="flex items-center">
          <span className="text-2xl font-bold text-luximo-700">Luximo</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-luximo-600 font-medium">
            Функции
          </a>
          <a href="#how-it-works" className="text-gray-700 hover:text-luximo-600 font-medium">
            Как работи
          </a>
          <a href="#benefits" className="text-gray-700 hover:text-luximo-600 font-medium">
            Ползи
          </a>
          <a href="#pricing" className="text-gray-700 hover:text-luximo-600 font-medium">
            Цени
          </a>
          <a href="#faq" className="text-gray-700 hover:text-luximo-600 font-medium">
            ЧЗВ
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="border-luximo-600 text-luximo-600 hover:bg-luximo-50">
            Вижте демо
          </Button>
          <Button className="bg-luximo-600 hover:bg-luximo-700">
            Свържете се с нас
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-4">
            <a href="#features" className="text-gray-700 hover:text-luximo-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Функции
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-luximo-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Как работи
            </a>
            <a href="#benefits" className="text-gray-700 hover:text-luximo-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Ползи
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-luximo-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
              Цени
            </a>
            <a href="#faq" className="text-gray-700 hover:text-luximo-600 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
              ЧЗВ
            </a>
            <div className="flex flex-col space-y-3 pt-2">
              <Button variant="outline" className="w-full border-luximo-600 text-luximo-600 hover:bg-luximo-50">
                Вижте демо
              </Button>
              <Button className="w-full bg-luximo-600 hover:bg-luximo-700">
                Свържете се с нас
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
