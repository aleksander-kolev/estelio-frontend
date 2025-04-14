
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardData } from "@/services/dashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SearchTrends = () => {
  const { user } = useAuth();
  if (!user) return null;

  const data = getDashboardData(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Анализ на търсенията</h2>
        <p className="text-muted-foreground">Подробна информация за търсенията на вашите клиенти.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Най-популярни търсения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.popularSearchTerms}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 150,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="term" 
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} търсения`, '']} 
                />
                <Bar dataKey="count" fill="#A08C73" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Детайли на търсенията</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Търсен термин</TableHead>
                  <TableHead className="text-right">Брой</TableHead>
                  <TableHead>Категория</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{data.popularSearchTerms[0]?.term}</TableCell>
                  <TableCell className="text-right">{data.popularSearchTerms[0]?.count}</TableCell>
                  <TableCell><Badge variant="outline">Апартамент</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{data.popularSearchTerms[1]?.term}</TableCell>
                  <TableCell className="text-right">{data.popularSearchTerms[1]?.count}</TableCell>
                  <TableCell><Badge variant="outline">Апартамент</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{data.popularSearchTerms[2]?.term}</TableCell>
                  <TableCell className="text-right">{data.popularSearchTerms[2]?.count}</TableCell>
                  <TableCell><Badge variant="outline">Къща</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{data.popularSearchTerms[3]?.term}</TableCell>
                  <TableCell className="text-right">{data.popularSearchTerms[3]?.count}</TableCell>
                  <TableCell><Badge variant="outline">Лукс</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">{data.popularSearchTerms[4]?.term}</TableCell>
                  <TableCell className="text-right">{data.popularSearchTerms[4]?.count}</TableCell>
                  <TableCell><Badge variant="outline">Мезонет</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Допълнителни филтри</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Най-търсени квартали</h4>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">Лозенец</Badge>
                  <Badge variant="secondary">Център</Badge>
                  <Badge variant="secondary">Изток</Badge>
                  <Badge variant="secondary">Бояна</Badge>
                  <Badge variant="secondary">Младост</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Ценови диапазони</h4>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">500-1000 лв</Badge>
                  <Badge variant="secondary">1000-1500 лв</Badge>
                  <Badge variant="secondary">1500-2000 лв</Badge>
                  <Badge variant="secondary">&gt; 2000 лв</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Тип имот</h4>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">Двустаен (42%)</Badge>
                  <Badge variant="secondary">Тристаен (31%)</Badge>
                  <Badge variant="secondary">Едностаен (15%)</Badge>
                  <Badge variant="secondary">Къща (8%)</Badge>
                  <Badge variant="secondary">Друго (4%)</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Тип транзакция</h4>
                <div className="flex gap-2">
                  <Badge variant="secondary">Под наем (68%)</Badge>
                  <Badge variant="secondary">Продажба (32%)</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchTrends;
