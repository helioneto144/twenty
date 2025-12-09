import styled from '@emotion/styled';
import { ResponsivePie } from '@nivo/pie';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import { Opportunity } from './ReportsDashboard';

const StyledChartContainer = styled.div`
  height: 220px;
  width: 100%;
`;

const StyledStatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledStat = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing(2)};
  background: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.border.radius.md};
`;

const StyledStatValue = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const StyledStatAmount = styled.div<{ color: string }>`
  color: ${({ color }) => color};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  opacity: 0.9;
`;

const StyledStatLabel = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

interface ClosedWonLostChartProps {
  opportunities: Opportunity[];
}

// Format currency in BRL
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const ClosedWonLostChart = ({
  opportunities,
}: ClosedWonLostChartProps) => {
  const theme = useTheme();

  const { chartData, stats } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    let closedWonMonth = 0;
    let closedWonYear = 0;
    let closedLostMonth = 0;
    let closedLostYear = 0;
    let amountWonMonth = 0;
    let amountWonYear = 0;
    let amountLostMonth = 0;
    let amountLostYear = 0;

    opportunities.forEach((opp) => {
      const closeDate = opp.closeDate ? new Date(opp.closeDate) : null;
      const createdDate = new Date(opp.createdAt);

      // Use closeDate if available, otherwise use createdAt
      const referenceDate = closeDate || createdDate;
      const amount = opp.amount?.amountMicros ? opp.amount.amountMicros / 1000000 : 0;

      // Check for CLOSED_WON stage
      if (opp.stage === 'CLOSED_WON') {
        if (referenceDate.getFullYear() === currentYear) {
          closedWonYear++;
          amountWonYear += amount;
          if (referenceDate.getMonth() === currentMonth) {
            closedWonMonth++;
            amountWonMonth += amount;
          }
        }
      }

      // Check for CLOSED_LOST stage
      if (opp.stage === 'CLOSED_LOST') {
        if (referenceDate.getFullYear() === currentYear) {
          closedLostYear++;
          amountLostYear += amount;
          if (referenceDate.getMonth() === currentMonth) {
            closedLostMonth++;
            amountLostMonth += amount;
          }
        }
      }
    });

    return {
      chartData: [
        { id: 'Won', label: 'Closed Won', value: amountWonYear, color: '#10B981' },
        { id: 'Lost', label: 'Closed Lost', value: amountLostYear, color: '#EF4444' },
      ],
      stats: {
        closedWonMonth, closedWonYear, closedLostMonth, closedLostYear,
        amountWonMonth, amountWonYear, amountLostMonth, amountLostYear
      },
    };
  }, [opportunities]);

  return (
    <>
      <StyledChartContainer>
        <ResponsivePie
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.6}
          padAngle={2}
          cornerRadius={4}
          colors={{ datum: 'data.color' }}
          enableArcLinkLabels={false}
          arcLabelsTextColor="#ffffff"
          valueFormat={(value) => formatCurrency(value)}
          theme={{
            text: { fill: theme.font.color.primary },
          }}
        />
      </StyledChartContainer>
      <StyledStatsContainer>
        <StyledStat>
          <StyledStatValue color="#10B981">{stats.closedWonMonth}</StyledStatValue>
          <StyledStatAmount color="#10B981">{formatCurrency(stats.amountWonMonth)}</StyledStatAmount>
          <StyledStatLabel>Won (Mês)</StyledStatLabel>
        </StyledStat>
        <StyledStat>
          <StyledStatValue color="#10B981">{stats.closedWonYear}</StyledStatValue>
          <StyledStatAmount color="#10B981">{formatCurrency(stats.amountWonYear)}</StyledStatAmount>
          <StyledStatLabel>Won (Ano)</StyledStatLabel>
        </StyledStat>
        <StyledStat>
          <StyledStatValue color="#EF4444">{stats.closedLostMonth}</StyledStatValue>
          <StyledStatAmount color="#EF4444">{formatCurrency(stats.amountLostMonth)}</StyledStatAmount>
          <StyledStatLabel>Lost (Mês)</StyledStatLabel>
        </StyledStat>
        <StyledStat>
          <StyledStatValue color="#EF4444">{stats.closedLostYear}</StyledStatValue>
          <StyledStatAmount color="#EF4444">{formatCurrency(stats.amountLostYear)}</StyledStatAmount>
          <StyledStatLabel>Lost (Ano)</StyledStatLabel>
        </StyledStat>
      </StyledStatsContainer>
    </>
  );
};

