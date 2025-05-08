import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChartGender = () => {
  const data = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        label: "Users",
        data: [120, 150, 10], // Example values for gender counts
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",   // Blue for Male
          "rgba(255, 99, 132, 0.7)",   // Pink for Female
          "rgba(255, 206, 86, 0.7)",   // Yellow for Other
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
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
        text: "Gender-wise User Distribution",
        font: { size: 16 },
      },
    },
  };

  return (
    <div className="w-1/3 bg-white p-4 rounded-md shadow-sm border">
      <h2 className="text-lg font-medium text-primary-txt mb-4">
        Gender Distribution
      </h2>
      <div className="flex justify-center items-center">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChartGender;
