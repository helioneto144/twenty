import styled from '@emotion/styled';
import { ResponsiveBar } from '@nivo/bar';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import { Opportunity } from './ReportsDashboard';

const StyledChartContainer = styled.div`
  height: 400px;
  width: 100%;
`;

interface TopSellersChartProps {
  opportunities: Opportunity[];
}

// Helper function to get seller email from responsavel field
const getSellerEmail = (opp: Opportunity): string => {
  // Priority 1: Use "responsavel" field email directly (e.g., "tuffy@fass.legal")
  if (opp.responsavel?.emails?.primaryEmail) {
    return opp.responsavel.emails.primaryEmail;
  }

  // Priority 2: Use pointOfContact email
  if (opp.pointOfContact?.emails?.primaryEmail) {
    return opp.pointOfContact.emails.primaryEmail;
  }

  // Priority 3: Use createdBy name as fallback
  if (opp.createdBy?.name) {
    return opp.createdBy.name;
  }

  return 'Não atribuído';
};

// Format currency in BRL
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export const TopSellersChart = ({ opportunities }: TopSellersChartProps) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    const sellerData: Record<string, { email: string; won: number; total: number; amount: number }> = {};

    opportunities.forEach((opp) => {
      const sellerEmail = getSellerEmail(opp);

      if (!sellerData[sellerEmail]) {
        sellerData[sellerEmail] = {
          email: sellerEmail,
          won: 0,
          total: 0,
          amount: 0,
        };
      }

      sellerData[sellerEmail].total++;

      // Count CLOSED_WON as wins and sum amounts
      if (opp.stage === 'CLOSED_WON') {
        sellerData[sellerEmail].won++;
        // Amount is stored directly (not in micros based on CSV data)
        if (opp.amount?.amountMicros) {
          sellerData[sellerEmail].amount += opp.amount.amountMicros / 1000000;
        }
      }
    });

    return Object.values(sellerData)
      .filter(seller => seller.email !== 'Não atribuído' && seller.won > 0)
      .sort((a, b) => b.amount - a.amount) // Sort by amount (value) instead of count
      .slice(0, 10)
      .map((seller) => ({
        seller: seller.email,
        won: seller.won,
        total: seller.total,
        amount: seller.amount,
      }));
  }, [opportunities]);

  if (chartData.length === 0) {
    return <div>Sem dados disponíveis</div>;
  }

  return (
    <StyledChartContainer>
      <ResponsiveBar
        data={chartData}
        keys={['amount']}
        indexBy="seller"
        layout="horizontal"
        margin={{ top: 20, right: 30, bottom: 50, left: 180 }}
        padding={0.3}
        colors={['#10B981']}
        borderRadius={4}
        valueFormat={(value) => formatCurrency(value as number)}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Valor Total (R$)',
          legendPosition: 'middle',
          legendOffset: 40,
          format: (value) => formatCurrency(value as number),
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        labelTextColor="#ffffff"
        label={d => formatCurrency(d.value as number)}
        theme={{
          text: { fill: theme.font.color.primary },
          axis: {
            ticks: { text: { fill: theme.font.color.secondary } },
            legend: { text: { fill: theme.font.color.primary } },
          },
          grid: { line: { stroke: theme.border.color.light } },
        }}
        tooltip={({ data }) => (
          <div
            style={{
              background: theme.background.primary,
              border: `1px solid ${theme.border.color.light}`,
              borderRadius: '4px',
              padding: '8px 12px',
            }}
          >
            <strong>{data.seller as string}</strong>
            <br />
            Vendas: {data.won}
            <br />
            Total Oportunidades: {data.total}
            <br />
            Valor: {formatCurrency(data.amount as number)}
          </div>
        )}
      />
    </StyledChartContainer>
  );
};

