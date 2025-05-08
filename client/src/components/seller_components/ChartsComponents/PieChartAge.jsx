import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChartAge = () => {
  const data = {
    labels: ["< 25", "25-37", "38-60", "> 60"],
    datasets: [
      {
        label: "Users by Age Group",
        data: [80, 130, 90, 30], // Example data
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",   // Teal for <25
          "rgba(153, 102, 255, 0.7)",  // Purple for 25–37
          "rgba(255, 159, 64, 0.7)",   // Orange for 38–60
          "rgba(201, 203, 207, 0.7)",  // Gray for >60
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(201, 203, 207, 1)",
        ],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Age-wise User Distribution",
        font: { size: 16 },
      },
    },
  };

  return (
    <div className="w-1/3 bg-white p-4 rounded-md shadow-sm border">
      <h2 className="text-lg font-medium text-primary-txt mb-4">
        Age Group Distribution
      </h2>
      <div className="flex justify-center items-center">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChartAge;
