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
  if (!data || Object.keys(data).length === 0) {
    return <div>No checkbox data available</div>;
  }

  const totalResponses = Object.values(data).reduce((sum, count) => sum + count, 0);
  const chartData = Object.entries(data).map(([name, count]) => ({
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