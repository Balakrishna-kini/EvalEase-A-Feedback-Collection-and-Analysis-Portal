import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface HalfDonutChartProps {
  data: { [option: string]: number };
}

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", 
  "#a4de6c", "#d0ed57", "#8dd1e1"
];

const HalfDonutChart: React.FC<HalfDonutChartProps> = ({ data }) => {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500 italic">No checkbox data available</div>;
  }

  // 🔹 Clean the keys: Checkbox data often comes in as "[Option A][Option B]" or "Option A, Option B"
  const cleanData: { [option: string]: number } = {};
  Object.entries(data).forEach(([key, count]) => {
    // If key is "[A][B]", split it into "A" and "B"
    const parts = key.match(/\[(.*?)\]/g) || [key];
    parts.forEach(p => {
      const cleanKey = p.replace(/[\[\]]/g, '').trim();
      if (cleanKey) {
        cleanData[cleanKey] = (cleanData[cleanKey] || 0) + count;
      }
    });
  });

  const totalResponses = Object.values(cleanData).reduce((sum, count) => sum + count, 0);
  const chartData = Object.entries(cleanData).map(([name, count]) => ({
    name,
    value: count,
    percentage: ((count / totalResponses) * 100).toFixed(0)
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${((value / totalResponses) * 100).toFixed(1)}%`, 'Percentage']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HalfDonutChart;