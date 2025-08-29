import React from "react";

interface SummaryBoxProps {
  label: string;
  value: string | number;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ label, value }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl shadow p-4 text-center">
      <p className="text-sm text-gray-600">{label}</p>
      <h2 className="text-xl font-bold mt-1 text-blue-800">{value}</h2>
    </div>
  );
};

export default SummaryBox;
