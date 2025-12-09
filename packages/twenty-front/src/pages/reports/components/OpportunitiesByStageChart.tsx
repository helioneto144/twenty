import styled from '@emotion/styled';
import { ResponsiveBar } from '@nivo/bar';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import { Opportunity } from './ReportsDashboard';

const StyledChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;

interface OpportunitiesByStageChartProps {
  opportunities: Opportunity[];
}

const STAGE_LABELS: Record<string, string> = {
  NEW: 'Novo',
  INBOUND: 'Inbound',
  OUTBOUND: 'Outbound',
  PROPOSAL: 'Proposta',
  CLOSED_WON: 'Fechado (Ganho)',
  CLOSED_LOST: 'Fechado (Perdido)',
};

const STAGE_COLORS: Record<string, string> = {
  NEW: '#3B82F6',
  INBOUND: '#8B5CF6',
  OUTBOUND: '#A855F7',
  PROPOSAL: '#10B981',
  CLOSED_WON: '#22C55E',
  CLOSED_LOST: '#EF4444',
};

// Main stages to display
const DISPLAY_STAGES = ['NEW', 'INBOUND', 'OUTBOUND', 'PROPOSAL', 'CLOSED_WON', 'CLOSED_LOST'] as const;

interface MonthlyStageData {
  month: string;
  NEW: number;
  INBOUND: number;
  OUTBOUND: number;
  PROPOSAL: number;
  CLOSED_WON: number;
  CLOSED_LOST: number;
  [key: string]: string | number;
}

export const OpportunitiesByStageChart = ({
  opportunities,
}: OpportunitiesByStageChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    const monthlyData: Record<string, MonthlyStageData> = {};

    opportunities.forEach((opp) => {
      const date = new Date(opp.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          NEW: 0,
          INBOUND: 0,
          OUTBOUND: 0,
          PROPOSAL: 0,
          CLOSED_WON: 0,
          CLOSED_LOST: 0,
        };
      }

      const stage = opp.stage;
      if (stage && stage in monthlyData[monthKey]) {
        (monthlyData[monthKey][stage] as number)++;
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
        keys={[...DISPLAY_STAGES]}
        indexBy="month"
        margin={{ top: 20, right: 160, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        colors={({ id }) => STAGE_COLORS[id as string] || '#888'}
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
            data: Object.entries(STAGE_LABELS).map(([id, label]) => ({
              id,
              label,
              color: STAGE_COLORS[id],
            })),
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

