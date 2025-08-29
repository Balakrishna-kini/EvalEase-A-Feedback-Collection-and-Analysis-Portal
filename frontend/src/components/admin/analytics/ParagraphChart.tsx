import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Text
} from 'recharts';

interface ParagraphChartProps {
  data: { [response: string]: number };
}

const COLORS = ['#4ade80', '#facc15', '#f87171', '#594adeff'];

const CustomYAxisTick = ({ x, y, payload }: any) => {
  return (
    <Text
      x={x}
      y={y}
      width={100}
      verticalAnchor="middle"
      textAnchor="end"
      fontSize={12}
    >
      {payload.value.length > 30 
        ? `${payload.value.substring(0, 30)}...` 
        : payload.value}
    </Text>
  );
};

const ParagraphChart: React.FC<ParagraphChartProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div>No text response data available</div>;
  }

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={<CustomYAxisTick />}
            width={120}
          />
          <Tooltip 
            formatter={(value: number) => [value, 'Responses']}
            labelFormatter={(label) => `Response: ${label}`}
          />
          <Legend />
          <Bar dataKey="value" name="Response Count">
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParagraphChart;