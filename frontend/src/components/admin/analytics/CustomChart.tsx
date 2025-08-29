import React, { useRef, useEffect } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";

interface CustomChartProps {
  config: ChartConfiguration;
}

const CustomChart: React.FC<CustomChartProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (canvasRef.current) {
      chartInstanceRef.current = new Chart(canvasRef.current, config);
    }

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [config]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default CustomChart;
