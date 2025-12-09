// Types for the Report Builder

export type ChartType = 'bar' | 'pie' | 'line' | 'horizontalBar';

export type AggregationType = 'count' | 'sum' | 'average';

export type GroupByField =
  | 'stage'
  | 'source'
  | 'responsavel'
  | 'month'
  | 'year'
  | 'quarter'
  | 'closeMonth';

export type MetricField =
  | 'count'
  | 'amount';

export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'greaterThan'
  | 'lessThan'
  | 'between'
  | 'in';

export interface ReportFilter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | number | string[] | [string, string] | [number, number];
}

export type ColorScheme =
  | 'nivo'
  | 'category10'
  | 'accent'
  | 'dark2'
  | 'paired'
  | 'pastel1'
  | 'pastel2'
  | 'set1'
  | 'set2'
  | 'set3'
  | 'blues'
  | 'greens'
  | 'oranges'
  | 'purples'
  | 'reds';

export interface ReportConfig {
  id: string;
  name: string;
  chartType: ChartType;
  groupBy: GroupByField;
  secondaryGroupBy?: GroupByField | null;
  metric: MetricField;
  aggregation: AggregationType;
  filters: ReportFilter[];
  colorScheme: ColorScheme;
  createdAt: string;
  updatedAt: string;
}

// Color scheme options
export const COLOR_SCHEME_OPTIONS: { value: ColorScheme; label: string }[] = [
  { value: 'nivo', label: 'Nivo (Padrão)' },
  { value: 'category10', label: 'Category 10' },
  { value: 'set1', label: 'Set 1 (Vibrante)' },
  { value: 'set2', label: 'Set 2 (Suave)' },
  { value: 'set3', label: 'Set 3 (Pastel)' },
  { value: 'pastel1', label: 'Pastel 1' },
  { value: 'pastel2', label: 'Pastel 2' },
  { value: 'accent', label: 'Accent' },
  { value: 'dark2', label: 'Dark 2' },
  { value: 'paired', label: 'Paired' },
  { value: 'blues', label: 'Azuis' },
  { value: 'greens', label: 'Verdes' },
  { value: 'oranges', label: 'Laranjas' },
  { value: 'purples', label: 'Roxos' },
  { value: 'reds', label: 'Vermelhos' },
];

// Stage options - alinhado com os valores reais do sistema
export const STAGE_OPTIONS = [
  { value: 'NEW', label: 'Novo' },
  { value: 'INBOUND', label: 'Inbound' },
  { value: 'OUTBOUND', label: 'Outbound' },
  { value: 'SCREENING', label: 'Triagem' },
  { value: 'MEETING', label: 'Reunião' },
  { value: 'PROPOSAL', label: 'Proposta' },
  { value: 'CUSTOMER', label: 'Cliente' },
  { value: 'CLOSED_WON', label: 'Fechado (Ganho)' },
  { value: 'CLOSED_LOST', label: 'Fechado (Perdido)' },
];

// Source options
export const SOURCE_OPTIONS = [
  { value: 'INBOUND', label: 'Inbound' },
  { value: 'OUTBOUND', label: 'Outbound' },
];

// Field definitions for the UI
export interface FieldDefinition {
  id: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'select' | 'multiselect';
  options?: { value: string; label: string }[];
}

export const GROUPBY_FIELDS: FieldDefinition[] = [
  { id: 'stage', label: 'Estágio', type: 'select', options: STAGE_OPTIONS },
  { id: 'source', label: 'Origem (Source)', type: 'select', options: SOURCE_OPTIONS },
  { id: 'responsavel', label: 'Responsável', type: 'string' },
  { id: 'month', label: 'Mês de Criação', type: 'date' },
  { id: 'closeMonth', label: 'Mês de Fechamento', type: 'date' },
  { id: 'year', label: 'Ano', type: 'date' },
  { id: 'quarter', label: 'Trimestre', type: 'date' },
];

export const METRIC_FIELDS: FieldDefinition[] = [
  { id: 'count', label: 'Quantidade', type: 'number' },
  { id: 'amount', label: 'Valor (R$)', type: 'number' },
];

export const CHART_TYPES: { id: ChartType; label: string; icon: string }[] = [
  { id: 'bar', label: 'Barras Verticais', icon: 'IconChartBar' },
  { id: 'horizontalBar', label: 'Barras Horizontais', icon: 'IconChartBarHorizontal' },
  { id: 'pie', label: 'Pizza', icon: 'IconChartPie' },
  { id: 'line', label: 'Linha', icon: 'IconChartLine' },
];

export const FILTER_FIELDS: FieldDefinition[] = [
  { id: 'stage', label: 'Estágio', type: 'multiselect', options: STAGE_OPTIONS },
  { id: 'source', label: 'Origem', type: 'select', options: SOURCE_OPTIONS },
  { id: 'responsavel', label: 'Responsável', type: 'string' },
  { id: 'createdAt', label: 'Data de Criação', type: 'date' },
  { id: 'closeDate', label: 'Data de Fechamento', type: 'date' },
  { id: 'amount', label: 'Valor', type: 'number' },
];

// Operators por tipo de campo
export const OPERATORS_BY_TYPE: Record<string, { value: FilterOperator; label: string }[]> = {
  string: [
    { value: 'equals', label: 'Igual a' },
    { value: 'notEquals', label: 'Diferente de' },
    { value: 'contains', label: 'Contém' },
  ],
  number: [
    { value: 'equals', label: 'Igual a' },
    { value: 'greaterThan', label: 'Maior que' },
    { value: 'lessThan', label: 'Menor que' },
    { value: 'between', label: 'Entre' },
  ],
  date: [
    { value: 'equals', label: 'Igual a' },
    { value: 'greaterThan', label: 'Depois de' },
    { value: 'lessThan', label: 'Antes de' },
    { value: 'between', label: 'Entre' },
  ],
  select: [
    { value: 'equals', label: 'Igual a' },
    { value: 'notEquals', label: 'Diferente de' },
  ],
  multiselect: [
    { value: 'in', label: 'Um de' },
    { value: 'notEquals', label: 'Nenhum de' },
  ],
};

