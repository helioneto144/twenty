import styled from '@emotion/styled';
import { useMemo } from 'react';
import { useTheme } from '@emotion/react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ReportConfig, ReportFilter, GroupByField, ColorScheme } from '../../types/ReportConfig';
import { Opportunity } from '../ReportsDashboard';

const StyledContainer = styled.div`
  height: 400px;
  width: 100%;
  background: ${({ theme }) => theme.background.primary};
  border-radius: ${({ theme }) => theme.border.radius.md};
  padding: ${({ theme }) => theme.spacing(4)};
`;

const StyledEmptyMessage = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.font.color.tertiary};
  text-align: center;
`;

const StyledTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing(4)} 0;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
`;

interface ReportPreviewProps {
  config: ReportConfig;
  opportunities: Opportunity[];
}

// Helper to format currency
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

// Helper to get responsible email from opportunity
// O campo responsavel é um campo de email direto (não uma relação)
const getResponsavelEmail = (opp: Opportunity): string => {
  // Responsavel é um campo de email direto com primaryEmail
  if (opp.responsavel?.primaryEmail) {
    return opp.responsavel.primaryEmail;
  }
  // Fallback para pointOfContact
  if (opp.pointOfContact?.emails?.primaryEmail) {
    return opp.pointOfContact.emails.primaryEmail;
  }
  return '';
};

// Apply filters to opportunities
const applyFilters = (opportunities: Opportunity[], filters: ReportFilter[]): Opportunity[] => {
  return opportunities.filter(opp => {
    return filters.every(filter => {
      const fieldValue = getFieldValue(opp, filter.field);
      const filterValue = filter.value;

      switch (filter.operator) {
        case 'equals':
          return fieldValue === filterValue;
        case 'notEquals':
          return fieldValue !== filterValue;
        case 'contains':
          return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'greaterThan':
          if (filter.field === 'createdAt' || filter.field === 'closeDate') {
            return new Date(String(fieldValue)) > new Date(String(filterValue));
          }
          return Number(fieldValue) > Number(filterValue);
        case 'lessThan':
          if (filter.field === 'createdAt' || filter.field === 'closeDate') {
            return new Date(String(fieldValue)) < new Date(String(filterValue));
          }
          return Number(fieldValue) < Number(filterValue);
        case 'in':
          if (Array.isArray(filterValue)) {
            return (filterValue as string[]).includes(String(fieldValue));
          }
          return String(filterValue).split(',').includes(String(fieldValue));
        case 'between':
          if (Array.isArray(filterValue) && filterValue.length === 2) {
            const val = Number(fieldValue);
            return val >= Number(filterValue[0]) && val <= Number(filterValue[1]);
          }
          return true;
        default:
          return true;
      }
    });
  });
};

// Get field value from opportunity
const getFieldValue = (opp: Opportunity, field: string): string | number | null => {
  switch (field) {
    case 'stage':
      return opp.stage;
    case 'source':
      return opp.source || '';
    case 'responsavel':
      return getResponsavelEmail(opp);
    case 'createdAt':
      return opp.createdAt;
    case 'closeDate':
      return opp.closeDate || '';
    case 'amount':
      return opp.amount?.amountMicros ? opp.amount.amountMicros / 1000000 : 0;
    default:
      return null;
  }
};

// Get group key for an opportunity
const getGroupKey = (opp: Opportunity, groupBy: GroupByField): string => {
  switch (groupBy) {
    case 'stage':
      return opp.stage;
    case 'source':
      return opp.source || 'Não definido';
    case 'responsavel':
      const email = getResponsavelEmail(opp);
      return email || 'Não atribuído';
    case 'month':
      const date = new Date(opp.createdAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    case 'closeMonth':
      if (!opp.closeDate) return 'Sem data';
      const closeDate = new Date(opp.closeDate);
      return `${closeDate.getFullYear()}-${String(closeDate.getMonth() + 1).padStart(2, '0')}`;
    case 'year':
      return new Date(opp.createdAt).getFullYear().toString();
    case 'quarter':
      const d = new Date(opp.createdAt);
      const q = Math.floor(d.getMonth() / 3) + 1;
      return `${d.getFullYear()} Q${q}`;
    default:
      return 'Outros';
  }
};

// Stage labels
const STAGE_LABELS: Record<string, string> = {
  NEW: 'Novo',
  INBOUND: 'Inbound',
  OUTBOUND: 'Outbound',
  SCREENING: 'Triagem',
  MEETING: 'Reunião',
  PROPOSAL: 'Proposta',
  CUSTOMER: 'Cliente',
  CLOSED_WON: 'Fechado (Ganho)',
  CLOSED_LOST: 'Fechado (Perdido)',
};

// Source labels
const SOURCE_LABELS: Record<string, string> = {
  INBOUND: 'Inbound',
  OUTBOUND: 'Outbound',
};

export const ReportPreview = ({ config, opportunities }: ReportPreviewProps) => {
  const theme = useTheme();
  
  const chartData = useMemo(() => {
    // Apply filters
    const filtered = config.filters.length > 0 
      ? applyFilters(opportunities, config.filters)
      : opportunities;
    
    // Group data
    const grouped: Record<string, { count: number; amount: number }> = {};
    
    filtered.forEach(opp => {
      const key = getGroupKey(opp, config.groupBy);
      if (!grouped[key]) {
        grouped[key] = { count: 0, amount: 0 };
      }
      grouped[key].count++;
      if (opp.amount?.amountMicros) {
        grouped[key].amount += opp.amount.amountMicros / 1000000;
      }
    });
    
    // Convert to chart format with proper labels
    const getLabel = (key: string) => {
      if (config.groupBy === 'stage') return STAGE_LABELS[key] || key;
      if (config.groupBy === 'source') return SOURCE_LABELS[key] || key;
      return key;
    };

    const entries = Object.entries(grouped).map(([key, data]) => ({
      id: getLabel(key),
      label: getLabel(key),
      value: config.metric === 'amount' ? data.amount : data.count,
    }));
    
    // Sort by value descending
    return entries.sort((a, b) => b.value - a.value);
  }, [opportunities, config]);

  if (opportunities.length === 0) {
    return (
      <StyledContainer>
        <StyledEmptyMessage>Carregando dados...</StyledEmptyMessage>
      </StyledContainer>
    );
  }

  if (chartData.length === 0) {
    return (
      <StyledContainer>
        <StyledEmptyMessage>Nenhum dado encontrado com os filtros aplicados</StyledEmptyMessage>
      </StyledContainer>
    );
  }

  const barData = chartData.map(d => ({ key: d.id, value: d.value }));
  const isAmount = config.metric === 'amount';
  const valueFormat = isAmount ? (v: number) => formatCurrency(v) : undefined;

  const nivoTheme = {
    text: { fill: theme.font.color.primary },
    axis: {
      ticks: { text: { fill: theme.font.color.secondary } },
      legend: { text: { fill: theme.font.color.primary } },
    },
    grid: { line: { stroke: theme.border.color.light } },
  };

  // Usar o colorScheme da config ou 'nivo' como padrão
  const colorScheme = config.colorScheme || 'nivo';

  return (
    <StyledContainer>
      <StyledTitle>{config.name || 'Preview'}</StyledTitle>
      <div style={{ height: 'calc(100% - 40px)' }}>
        {config.chartType === 'pie' ? (
          <ResponsivePie
            data={chartData}
            margin={{ top: 20, right: 120, bottom: 20, left: 20 }}
            innerRadius={0.5}
            padAngle={2}
            cornerRadius={4}
            colors={{ scheme: colorScheme as ColorScheme }}
            arcLabelsTextColor="#ffffff"
            valueFormat={valueFormat}
            legends={[{
              anchor: 'right',
              direction: 'column',
              translateX: 100,
              itemWidth: 80,
              itemHeight: 20,
              itemTextColor: theme.font.color.secondary,
              symbolSize: 12,
            }]}
            theme={nivoTheme}
          />
        ) : config.chartType === 'line' ? (
          <ResponsiveLine
            data={[{ id: config.name, data: chartData.map((d) => ({ x: d.id, y: d.value })) }]}
            margin={{ top: 20, right: 30, bottom: 60, left: 80 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            axisBottom={{ tickRotation: -45 }}
            axisLeft={{ format: isAmount ? (v) => formatCurrency(v as number) : undefined }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            colors={{ scheme: colorScheme as ColorScheme }}
            enableArea={true}
            theme={nivoTheme}
          />
        ) : (
          <ResponsiveBar
            data={barData}
            keys={['value']}
            indexBy="key"
            layout={config.chartType === 'horizontalBar' ? 'horizontal' : 'vertical'}
            margin={{
              top: 20,
              right: 30,
              bottom: config.chartType === 'horizontalBar' ? 40 : 80,
              left: config.chartType === 'horizontalBar' ? 150 : 80
            }}
            padding={0.3}
            colors={{ scheme: colorScheme as ColorScheme }}
            borderRadius={4}
            valueFormat={valueFormat}
            axisBottom={{
              tickRotation: config.chartType === 'horizontalBar' ? 0 : -45,
              format: config.chartType === 'horizontalBar' && isAmount
                ? (v) => formatCurrency(v as number) : undefined,
            }}
            axisLeft={{
              format: config.chartType !== 'horizontalBar' && isAmount
                ? (v) => formatCurrency(v as number) : undefined,
            }}
            labelTextColor="#ffffff"
            theme={nivoTheme}
          />
        )}
      </div>
    </StyledContainer>
  );
};

