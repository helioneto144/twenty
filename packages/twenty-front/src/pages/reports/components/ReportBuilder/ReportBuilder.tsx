import styled from '@emotion/styled';
import { useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import {
  ReportConfig,
  GroupByField,
  MetricField,
  ColorScheme,
  GROUPBY_FIELDS,
  METRIC_FIELDS,
  COLOR_SCHEME_OPTIONS,
} from '../../types/ReportConfig';
import { savedReportsState, isReportBuilderOpenState } from '../../states/savedReportsState';
import { ChartTypeSelector } from './ChartTypeSelector';
import { FieldSelector } from './FieldSelector';
import { FilterBuilder } from './FilterBuilder';
import { ReportPreview } from './ReportPreview';
import { Opportunity } from '../ReportsDashboard';

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledModal = styled.div`
  background: ${({ theme }) => theme.background.primary};
  border-radius: ${({ theme }) => theme.border.radius.md};
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(4)};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
`;

const StyledTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  flex: 1;
  overflow: hidden;
`;

const StyledSidebar = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  border-right: 1px solid ${({ theme }) => theme.border.color.light};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const StyledPreviewArea = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  overflow-y: auto;
  background: ${({ theme }) => theme.background.secondary};
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ variant, theme }) => variant === 'primary' ? `
    background: ${theme.color.blue};
    color: white;
    border: none;
    &:hover { opacity: 0.9; }
  ` : `
    background: transparent;
    color: ${theme.font.color.primary};
    border: 1px solid ${theme.border.color.medium};
    &:hover { background: ${theme.background.tertiary}; }
  `}
`;

const StyledCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.font.color.secondary};
  &:hover { color: ${({ theme }) => theme.font.color.primary}; }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-size: ${({ theme }) => theme.font.size.md};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.font.color.primary};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledLabel = styled.label`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.font.color.secondary};
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-size: ${({ theme }) => theme.font.size.md};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.font.color.primary};
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

interface ReportBuilderProps {
  opportunities: Opportunity[];
  editingReport?: ReportConfig | null;
}

export const ReportBuilder = ({ opportunities, editingReport }: ReportBuilderProps) => {
  const [, setSavedReports] = useRecoilState(savedReportsState);
  const [isOpen, setIsOpen] = useRecoilState(isReportBuilderOpenState);
  
  const [config, setConfig] = useState<Partial<ReportConfig>>(() => editingReport || {
    name: 'Novo Relatório',
    chartType: 'bar',
    groupBy: 'stage',
    metric: 'count',
    aggregation: 'count',
    filters: [],
    colorScheme: 'nivo',
  });

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleSave = useCallback(() => {
    const now = new Date().toISOString();
    const newReport: ReportConfig = {
      id: editingReport?.id || uuidv4(),
      name: config.name || 'Sem nome',
      chartType: config.chartType || 'bar',
      groupBy: config.groupBy || 'stage',
      metric: config.metric || 'count',
      aggregation: config.aggregation || 'count',
      filters: config.filters || [],
      colorScheme: config.colorScheme || 'nivo',
      createdAt: editingReport?.createdAt || now,
      updatedAt: now,
    };

    if (editingReport) {
      setSavedReports(prev => prev.map(r => r.id === editingReport.id ? newReport : r));
    } else {
      setSavedReports(prev => [...prev, newReport]);
    }

    handleClose();
  }, [config, editingReport, setSavedReports, handleClose]);

  if (!isOpen) return null;

  return (
    <StyledOverlay onClick={handleClose}>
      <StyledModal onClick={e => e.stopPropagation()}>
        <StyledHeader>
          <StyledTitle>{editingReport ? 'Editar Relatório' : 'Criar Novo Relatório'}</StyledTitle>
          <StyledCloseButton onClick={handleClose}>×</StyledCloseButton>
        </StyledHeader>
        
        <StyledContent>
          <StyledSidebar>
            <StyledSection>
              <StyledLabel>Nome do Relatório</StyledLabel>
              <StyledInput
                type="text"
                value={config.name || ''}
                onChange={e => setConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Digite o nome..."
              />
            </StyledSection>

            <ChartTypeSelector
              value={config.chartType || 'bar'}
              onChange={(chartType) => setConfig(prev => ({ ...prev, chartType }))}
            />

            <FieldSelector
              label="Agrupar por"
              fields={GROUPBY_FIELDS}
              value={config.groupBy || 'stage'}
              onChange={(groupBy) => setConfig(prev => ({ ...prev, groupBy: groupBy as GroupByField }))}
            />

            <FieldSelector
              label="Métrica"
              fields={METRIC_FIELDS}
              value={config.metric || 'count'}
              onChange={(metric) => setConfig(prev => ({ ...prev, metric: metric as MetricField }))}
            />

            <FilterBuilder
              filters={config.filters || []}
              onChange={(filters) => setConfig(prev => ({ ...prev, filters }))}
            />

            <StyledSection>
              <StyledLabel>Esquema de Cores</StyledLabel>
              <StyledSelect
                value={config.colorScheme || 'nivo'}
                onChange={(e) => setConfig(prev => ({ ...prev, colorScheme: e.target.value as ColorScheme }))}
              >
                {COLOR_SCHEME_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </StyledSelect>
            </StyledSection>
          </StyledSidebar>

          <StyledPreviewArea>
            <ReportPreview config={config as ReportConfig} opportunities={opportunities} />
          </StyledPreviewArea>
        </StyledContent>

        <StyledFooter>
          <StyledButton variant="secondary" onClick={handleClose}>
            Cancelar
          </StyledButton>
          <StyledButton variant="primary" onClick={handleSave}>
            Salvar Relatório
          </StyledButton>
        </StyledFooter>
      </StyledModal>
    </StyledOverlay>
  );
};

