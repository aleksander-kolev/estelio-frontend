
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardData } from "@/services/dashboardData";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Search, TrendingUp, Clock } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell, 
  LineChart, Line as RechartsLine 
} from 'recharts';

// Colors for charts
const COLORS = ["#A08C73", "#B39F80", "#C6B399", "#D9C9AD", "#E6DBC9"];

const Overview = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const data = getDashboardData(user.id);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Обзор</h2>
        <p className="text-muted-foreground">Преглед на вашата активност и представяне.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Общо чатове"
          value={data.totalChats}
          description="Брой започнати чатове"
          icon={<MessageSquare className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Общо търсения"
          value={data.totalSearches}
          description="Извършени търсения"
          icon={<Search className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Конверсия"
          value={`${(data.conversionRate * 100).toFixed(1)}%`}
          description="Заявки след чат"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 2.5, isPositive: true }}
        />
        <StatsCard
          title="Средно време"
          value={data.averageSessionTime}
          description="Минути на сесия"
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 0.3, isPositive: false }}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Conversion Trend Chart */}
        <Card className="col-span-7 md:col-span-4">
          <CardHeader>
            <CardTitle>Конверсия през времето</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.conversionTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A08C73" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#A08C73" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    tickLine={false}
                    domain={[0, 'dataMax + 0.05']}
                  />
                  <RechartsTooltip 
                    formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Конверсия']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#A08C73" 
                    fillOpacity={1} 
                    fill="url(#colorConversion)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Popular Features */}
        <Card className="col-span-7 md:col-span-3">
          <CardHeader>
            <CardTitle>Най-търсени характеристики</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.popularFeatures}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="requestCount"
                    nameKey="feature"
                  >
                    {data.popularFeatures.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`${value} запитвания`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Chat Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Чатове по дни</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chatMetrics}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => [`${value} чата`, '']} />
                  <Bar dataKey="conversations" fill="#A08C73" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity by Hour */}
        <Card>
          <CardHeader>
            <CardTitle>Активност по часове</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.activityByHour}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(value) => `${value}:00`}
                  />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value) => [`${value} потребители`, '']}
                    labelFormatter={(label) => `${label}:00ч`}
                  />
                  <RechartsLine 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#A08C73" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#A08C73" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
