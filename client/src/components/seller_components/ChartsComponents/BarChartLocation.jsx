import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const BarChartLocation = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  // Example dataset for different years
  const yearWiseData = {
    "2020": {
      locations: ["Pune", "Mumbai", "Kolkata", "Delhi", "Bangalore"],
      revenue: [2200, 3200, 1800, 4000, 3500],
      orders: [180, 240, 130, 300, 270],
    },
    "2021": {
      locations: ["Pune", "Mumbai", "Kolkata", "Delhi", "Bangalore"],
      revenue: [2500, 3500, 2100, 4200, 3700],
      orders: [200, 280, 150, 310, 290],
    },
    "2022": {
      locations: ["Pune", "Mumbai", "Kolkata", "Delhi", "Bangalore"],
      revenue: [2800, 3600, 2200, 4400, 3900],
      orders: [220, 300, 170, 330, 310],
    },
    "2023": {
      locations: ["Pune", "Mumbai", "Kolkata", "Delhi", "Bangalore"],
      revenue: [3000, 3700, 2400, 4600, 4100],
      orders: [240, 320, 190, 350, 330],
    },
    "2024": {
      locations: ["Pune", "Mumbai", "Kolkata", "Delhi", "Bangalore"],
      revenue: [3300, 4000, 2700, 4900, 4300],
      orders: [260, 340, 210, 370, 350],
    },
  };

  const chartData = {
    labels: yearWiseData[selectedYear]?.locations || [],
    datasets: [
      {
        label: "Revenue (Rs.)",
        data: yearWiseData[selectedYear]?.revenue || [],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderRadius: 4,
      },
      {
        label: "Orders",
        data: yearWiseData[selectedYear]?.orders || [],
        backgroundColor: "rgba(255, 159, 64, 0.7)",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Location-wise Sales (${selectedYear})` },
    },
    scales: {
      x: {
        grid: { drawOnChartArea: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(200, 200, 200, 0.3)" },
      },
    },
  };

  return (
    <div className="w-full md:w-2/3 bg-white p-4 rounded-md shadow-sm border">
      <header className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-primary-txt">
          Location-wise Sales
        </h2>
        <select
          className="border py-2 px-3 text-sm outline-none rounded-md text-[#8b8b8b]"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Select Year</option>
          {[2020, 2021, 2022, 2023, 2024].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </header>
      <main>
        <Bar data={chartData} options={options} />
      </main>
    </div>
  );
};

export default BarChartLocation;
