import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface McqChartProps {
  data: { [option: string]: number };
}

const McqChart: React.FC<McqChartProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div>No multiple choice data available</div>;
  }

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          '#60a5fa', // blue
          '#facc15', // yellow
          '#f87171', // red
          '#34d399', // green
          '#a78bfa', // purple
          '#f472b6', // pink
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px]">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default McqChart;