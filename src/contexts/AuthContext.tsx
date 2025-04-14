
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  agencyName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USERS = [
  { id: "1", email: "luximo@example.com", password: "password123", agencyName: "Luximo Real Estate" },
  { id: "2", email: "sofia@example.com", password: "password123", agencyName: "Sofia Properties" },
  { id: "3", email: "varna@example.com", password: "password123", agencyName: "Varna Luxury Homes" }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("estilio_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Find user with matching credentials
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("estilio_user", JSON.stringify(userWithoutPassword));
        navigate("/dashboard");
        toast({
          title: "Успешен вход",
          description: `Добре дошли, ${userWithoutPassword.agencyName}!`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Грешка при вписване",
          description: "Невалиден имейл или парола",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Грешка при вписване",
        description: "Възникна проблем. Моля, опитайте отново.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("estilio_user");
    navigate("/");
    toast({
      title: "Успешно излизане",
      description: "Довиждане!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
