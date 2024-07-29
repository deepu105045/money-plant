import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Legend, Title, Tooltip } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

interface FinanceChartProps {
  data: { date: string; income: number; expense: number; investment: number }[];
}

const CashflowChart: React.FC<FinanceChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Income',
        data: data.map((item) => item.income),
        backgroundColor: 'rgba(0, 128, 0, 0.6)',
        borderColor: 'rgba(0, 128, 0, 1)',
        borderWidth: 1,
      },
      {
        type: 'line' as const,
        label: 'Expense',
        data: data.map((item) => item.expense),
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        fill: false,
        tension: 0.1,
      },
      {
        type: 'line' as const,
        label: 'Investment',
        data: data.map((item) => item.investment),
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income, Expense, and Investment Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount',
        },
      },
    },
  };

  return <Chart type='bar' data={chartData} options={options} />;
};

export default CashflowChart;
