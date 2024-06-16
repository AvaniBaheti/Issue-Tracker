import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { supabase } from '../utils/supabaseClient';
import { IssueStatus } from '../models/IssueStatus';

Chart.register(ArcElement, Tooltip, Legend);

const IssueChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({
    labels: ['Open', 'Closed', 'In Progress'],
    datasets: [
      {
        label: 'Issues',
        data: [0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  });

  useEffect(() => {
    const fetchIssueData = async () => {
      const { data, error } = await supabase.from('issues').select('*');
      if (error) {
        console.error('Error fetching issues:', error);
        return;
      }

      const openIssues = data.filter((issue: any) => issue.status === IssueStatus.OPEN).length;
      const closedIssues = data.filter((issue: any) => issue.status === IssueStatus.CLOSED).length;
      const inProgressIssues = data.filter((issue: any) => issue.status === IssueStatus.IN_PROGRESS).length;

      setChartData({
        labels: ['Open', 'Closed', 'In Progress'],
        datasets: [
          {
            label: 'Issues',
            data: [openIssues, closedIssues, inProgressIssues],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      });
    };

    fetchIssueData();
  }, []);

  return <Doughnut data={chartData} />;
};

export default IssueChart;
