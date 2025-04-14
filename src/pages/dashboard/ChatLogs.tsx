
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardData } from "@/services/dashboardData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, ChevronDown, Search } from "lucide-react";

// Mock chat log data
const chatLogs = [
  {
    id: "chat-1",
    user: "Клиент 45791",
    date: "2023-06-15 14:32:24",
    query: "Търся двустаен апартамент в Лозенец с бюджет до 800 евро",
    duration: "4:12",
    status: "converted"
  },
  {
    id: "chat-2",
    user: "Клиент 45823",
    date: "2023-06-15 15:47:12",
    query: "Имате ли тристайни апартаменти в центъра?",
    duration: "2:35",
    status: "completed"
  },
  {
    id: "chat-3",
    user: "Клиент 45844",
    date: "2023-06-15 16:18:05",
    query: "Апартаменти с 2 спални и паркомясто",
    duration: "5:21",
    status: "converted"
  },
  {
    id: "chat-4",
    user: "Клиент 45872",
    date: "2023-06-15 17:42:51",
    query: "Къща с двор в кв. Бояна до 500000 евро",
    duration: "3:05",
    status: "completed"
  },
  {
    id: "chat-5",
    user: "Клиент 45901",
    date: "2023-06-15 18:23:17",
    query: "Луксозен апартамент под наем в нова сграда",
    duration: "6:47",
    status: "converted"
  },
  {
    id: "chat-6",
    user: "Клиент 45932",
    date: "2023-06-15 19:04:39",
    query: "Студио в Студентски град до 600 лв месечно",
    duration: "1:58",
    status: "abandoned"
  },
  {
    id: "chat-7",
    user: "Клиент 45956",
    date: "2023-06-15 19:38:02",
    query: "Обзаведен апартамент близо до метро",
    duration: "3:27",
    status: "completed"
  }
];

const ChatLogs = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedChat, setExpandedChat] = useState<string | null>(null);
  
  if (!user) return null;
  
  const data = getDashboardData(user.id);
  
  const filteredLogs = chatLogs.filter(log => 
    log.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleChat = (id: string) => {
    setExpandedChat(expandedChat === id ? null : id);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Чат логове</h2>
        <p className="text-muted-foreground">Преглед на разговорите с клиенти.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Търсене в чатовете..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">Филтър</Button>
        <Button variant="outline">Експорт</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Последни разговори</CardTitle>
          <CardDescription>Преглед на последните взаимодействия с клиенти</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Клиент</TableHead>
                <TableHead>Дата/Час</TableHead>
                <TableHead>Запитване</TableHead>
                <TableHead>Продължителност</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>{new Date(log.date).toLocaleString('bg-BG')}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{log.query}</TableCell>
                  <TableCell>{log.duration}</TableCell>
                  <TableCell>
                    <Badge variant={
                      log.status === "converted" ? "default" :
                      log.status === "completed" ? "secondary" : "outline"
                    }>
                      {log.status === "converted" ? "Конвертиран" :
                       log.status === "completed" ? "Завършен" : "Изоставен"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleChat(log.id)}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${
                        expandedChat === log.id ? 'rotate-180' : ''
                      }`} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Няма намерени резултати за "{searchTerm}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ефективност на чат асистента</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Точност на отговорите</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-luximo-600 rounded-full w-[92%]"></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Скорост на отговор</span>
                <span className="font-bold">1.8 сек</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-luximo-600 rounded-full w-[88%]"></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Успешно предложени имоти</span>
                <span className="font-bold">78%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-luximo-600 rounded-full w-[78%]"></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Конверсия на чатове</span>
                <span className="font-bold">{(data.conversionRate * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-luximo-600 rounded-full" style={{ width: `${data.conversionRate * 100}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Чат статистика</CardTitle>
              <CardDescription>Данни за последните 30 дни</CardDescription>
            </div>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Общо чатове</p>
                  <p className="text-2xl font-bold">{data.totalChats}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Среден рейтинг</p>
                  <p className="text-2xl font-bold">4.7/5</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Конвертирани</p>
                  <p className="text-2xl font-bold">{Math.round(data.totalChats * data.conversionRate)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Средно време</p>
                  <p className="text-2xl font-bold">{data.averageSessionTime}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatLogs;
