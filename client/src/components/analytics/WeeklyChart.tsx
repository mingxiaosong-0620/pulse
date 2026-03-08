import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { format, addDays } from 'date-fns';

interface DailyCategory {
  date: string;
  category_id: number;
  category_name: string;
  color: string;
  total_minutes: number;
}

interface CategoryDef {
  id: number;
  name: string;
  color: string;
}

interface WeeklyChartProps {
  weekStart: Date;
  dailyData: DailyCategory[];
  categories: CategoryDef[];
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeeklyChart({ weekStart, dailyData, categories }: WeeklyChartProps) {
  // Build chart data: one row per day, with a key per category (hours)
  const chartData = DAY_LABELS.map((dayLabel, i) => {
    const date = format(addDays(weekStart, i), 'yyyy-MM-dd');
    const row: Record<string, number | string> = { day: dayLabel };

    categories.forEach((cat) => {
      const match = dailyData.find(
        (d) => d.date === date && d.category_id === cat.id,
      );
      row[cat.name] = match ? Math.round((match.total_minutes / 60) * 100) / 100 : 0;
    });

    return row;
  });

  const hasData = dailyData.length > 0;

  return (
    <div className="px-4 py-2">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Daily Breakdown</h3>
        {!hasData ? (
          <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
            No data for this week
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickFormatter={(v: number) => `${v}h`}
                width={32}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => [
                  `${(value * 60).toFixed(0)}m`,
                  name,
                ]}
              />
              {categories.map((cat, i) => (
                <Bar
                  key={cat.id}
                  dataKey={cat.name}
                  stackId="a"
                  fill={cat.color}
                  radius={
                    i === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
