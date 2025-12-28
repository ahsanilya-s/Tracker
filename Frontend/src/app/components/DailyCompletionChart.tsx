import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DailyCompletionChartProps {
  data: { day: number; completed: number; total: number }[];
  month: number; // 0-indexed (January = 0, December = 11)
  year: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    if (data) {
      const completionRate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
      return (
        <div className="bg-white p-3 border-2 border-black shadow-lg rounded">
          <p className="font-semibold">Day {label}</p>
          <p className="text-blue-600">Total Tasks: {data.total}</p>
          <p className="text-green-600">Completed: {data.completed}</p>
          <p className="text-purple-600">Completion Rate: {completionRate}%</p>
        </div>
      );
    }
  }
  return null;
}

export function DailyCompletionChart({ data, month, year }: DailyCompletionChartProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Ensure we have data for all days in the month
  const fullData = Array.from({ length: daysInMonth }, (_, i) => {
    const dayData = data.find(d => d.day === i + 1);
    return {
      day: i + 1,
      completed: dayData ? dayData.completed : 0,
      total: dayData ? dayData.total : 0,
      remaining: dayData ? dayData.total - dayData.completed : 0
    };
  });

  return (
    <div className="bg-white border-2 border-black p-4 mb-4">
      <h3 className="mb-4 text-lg font-semibold">Daily Goal Progress - Total vs Completed Tasks</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={fullData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="day" 
            label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'Number of Tasks', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Total tasks as bars */}
          <Bar 
            dataKey="total" 
            fill="#e3f2fd" 
            stroke="#1976d2" 
            strokeWidth={1}
            name="Total Tasks"
            opacity={0.7}
          />
          
          {/* Completed tasks as area */}
          <Area 
            type="monotone" 
            dataKey="completed" 
            stroke="#4caf50" 
            fill="#c8e6c9" 
            strokeWidth={2}
            name="Completed Tasks"
            fillOpacity={0.8}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>• Blue bars show total tasks available each day</p>
        <p>• Green area shows completed tasks each day</p>
        <p>• Hover over any day to see detailed completion statistics</p>
      </div>
    </div>
  );
}
