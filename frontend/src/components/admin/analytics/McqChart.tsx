import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface McqChartProps {
  data: { [option: string]: number };
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
];

const McqChart: React.FC<McqChartProps> = ({ data }) => {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500 italic">No multiple choice data available</div>;
  }

  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number, name: string) => {
              const percentage = ((value / total) * 100).toFixed(1);
              return [`${value} (${percentage}%)`, name];
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-gray-600 text-sm font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default McqChart;