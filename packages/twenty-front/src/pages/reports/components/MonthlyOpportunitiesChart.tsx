import styled from '@emotion/styled';
import { ResponsiveBar } from '@nivo/bar';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import { Opportunity } from './ReportsDashboard';

const StyledChartContainer = styled.div`
  height: 280px;
  width: 100%;
`;

interface MonthlyOpportunitiesChartProps {
  opportunities: Opportunity[];
}

interface MonthlyData {
  month: string;
  new: number;
  inbound: number;
  outbound: number;
  proposal: number;
  [key: string]: string | number;
}

export const MonthlyOpportunitiesChart = ({
  opportunities,
}: MonthlyOpportunitiesChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    const monthlyData: Record<string, MonthlyData> = {};

    opportunities.forEach((opp) => {
      const date = new Date(opp.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          new: 0,
          inbound: 0,
          outbound: 0,
          proposal: 0,
        };
      }

      if (opp.stage === 'NEW') {
        monthlyData[monthKey].new++;
      }
      if (opp.stage === 'INBOUND') {
        monthlyData[monthKey].inbound++;
      }
      if (opp.stage === 'OUTBOUND') {
        monthlyData[monthKey].outbound++;
      }
      if (opp.stage === 'PROPOSAL') {
        monthlyData[monthKey].proposal++;
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);
  }, [opportunities]);

  if (chartData.length === 0) {
    return <div>Sem dados disponíveis</div>;
  }

  return (
    <StyledChartContainer>
      <ResponsiveBar
        data={chartData}
        keys={['new', 'inbound', 'outbound', 'proposal']}
        indexBy="month"
        margin={{ top: 20, right: 120, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        colors={['#3B82F6', '#8B5CF6', '#A855F7', '#10B981']}
        borderRadius={4}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Mês',
          legendPosition: 'middle',
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Quantidade',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            translateX: 120,
            itemWidth: 100,
            itemHeight: 20,
            itemTextColor: theme.font.color.secondary,
            symbolSize: 12,
            symbolShape: 'circle',
            data: [
              { id: 'new', label: 'Novos', color: '#3B82F6' },
              { id: 'inbound', label: 'Inbound', color: '#8B5CF6' },
              { id: 'outbound', label: 'Outbound', color: '#A855F7' },
              { id: 'proposal', label: 'Proposta', color: '#10B981' },
            ],
          },
        ]}
        theme={{
          text: { fill: theme.font.color.primary },
          axis: {
            ticks: { text: { fill: theme.font.color.secondary } },
            legend: { text: { fill: theme.font.color.primary } },
          },
          grid: { line: { stroke: theme.border.color.light } },
        }}
      />
    </StyledChartContainer>
  );
};

