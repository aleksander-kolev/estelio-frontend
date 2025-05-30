
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Search, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X
} from "lucide-react";

const DashboardNav = () => {
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-luximo-700">Estelio</span>
            </Link>
            <span className="ml-6 text-sm font-medium text-gray-500 hidden md:block">
              {user?.email}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                isActive("/dashboard")
                  ? "bg-luximo-50 text-luximo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Обзор
            </Link>
            
            <Link
              to="/dashboard/search-trends"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                isActive("/dashboard/search-trends")
                  ? "bg-luximo-50 text-luximo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Search className="mr-2 h-4 w-4" />
              Търсения
            </Link>
            
            <Link
              to="/dashboard/chat-logs"
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                isActive("/dashboard/chat-logs")
                  ? "bg-luximo-50 text-luximo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Чатове
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Изход
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 p-2"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 bg-white border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col">
              <div className="px-4 py-2 text-sm font-medium text-gray-500">
                {user?.email}
              </div>
              <Link
                to="/dashboard"
                className={`px-4 py-2 text-sm font-medium flex items-center ${
                  isActive("/dashboard")
                    ? "bg-luximo-50 text-luximo-700"
                    : "text-gray-700"
                }`}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Обзор
              </Link>
              
              <Link
                to="/dashboard/search-trends"
                className={`px-4 py-2 text-sm font-medium flex items-center ${
                  isActive("/dashboard/search-trends")
                    ? "bg-luximo-50 text-luximo-700"
                    : "text-gray-700"
                }`}
              >
                <Search className="mr-2 h-4 w-4" />
                Търсения
              </Link>
              
              <Link
                to="/dashboard/chat-logs"
                className={`px-4 py-2 text-sm font-medium flex items-center ${
                  isActive("/dashboard/chat-logs")
                    ? "bg-luximo-50 text-luximo-700"
                    : "text-gray-700"
                }`}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Чатове
              </Link>
              
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 flex items-center hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Изход
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardNav;
