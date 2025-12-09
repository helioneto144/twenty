import styled from '@emotion/styled';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useRecoilState } from 'recoil';
import { useMemo, useState, useCallback } from 'react';
import { ReportCard } from './ReportCard';
import { ReportBuilder } from './ReportBuilder';
import { SavedReportCard } from './SavedReportCard';
import { savedReportsState, isReportBuilderOpenState } from '../states/savedReportsState';
import { ReportConfig } from '../types/ReportConfig';

const StyledDashboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)};
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

const StyledFullWidthCard = styled.div`
  width: 100%;
`;

const StyledLoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(8)};
  color: ${({ theme }) => theme.font.color.secondary};
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledSectionTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledCreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.color.blue};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const StyledSavedReportsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(400px, auto);

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export type OpportunityStage =
  | 'NEW'
  | 'SCREENING'
  | 'MEETING'
  | 'PROPOSAL'
  | 'CUSTOMER'
  | 'CLOSED_WON'
  | 'CLOSED_LOST'
  | 'INBOUND'
  | 'OUTBOUND';

export type OpportunitySource = 'INBOUND' | 'OUTBOUND' | string;

export interface Opportunity {
  __typename: string;
  id: string;
  name: string;
  stage: OpportunityStage;
  source?: OpportunitySource | null;
  amount?: {
    amountMicros: number;
    currencyCode: string;
  } | null;
  closeDate?: string | null;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  createdBy?: {
    source: string;
    workspaceMemberId: string | null;
    name: string;
    context: Record<string, unknown> | null;
  } | null;
  // Responsável field - campo direto de email (não é relação)
  responsavel?: {
    primaryEmail: string;
    additionalEmails?: string[];
  } | null;
  // Standard pointOfContact field
  pointOfContact?: {
    id: string;
    emails?: {
      primaryEmail: string;
      additionalEmails?: string[];
    } | null;
    name?: {
      firstName: string;
      lastName: string;
    } | null;
  } | null;
  pointOfContactId?: string | null;
}

export const ReportsDashboard = () => {
  const [savedReports, setSavedReports] = useRecoilState(savedReportsState);
  const [isBuilderOpen, setIsBuilderOpen] = useRecoilState(isReportBuilderOpenState);
  const [editingReport, setEditingReport] = useState<ReportConfig | null>(null);

  const { records: opportunities, loading } = useFindManyRecords<Opportunity>({
    objectNameSingular: 'opportunity',
    recordGqlFields: {
      id: true,
      name: true,
      stage: true,
      source: true,
      amount: true,
      closeDate: true,
      createdAt: true,
      createdBy: true,
      // Responsável field - campo de email direto (não é relação)
      responsavel: true,
      // Standard pointOfContact field
      pointOfContact: {
        id: true,
        emails: true,
        name: true,
      },
      pointOfContactId: true,
    },
    limit: 10000,
  });

  const opportunitiesData = useMemo(() => {
    if (!opportunities) return [];
    return opportunities as Opportunity[];
  }, [opportunities]);

  const handleCreateReport = useCallback(() => {
    setEditingReport(null);
    setIsBuilderOpen(true);
  }, [setIsBuilderOpen]);

  const handleEditReport = useCallback((report: ReportConfig) => {
    setEditingReport(report);
    setIsBuilderOpen(true);
  }, [setIsBuilderOpen]);

  const handleDeleteReport = useCallback((reportId: string) => {
    setSavedReports(prev => prev.filter(r => r.id !== reportId));
  }, [setSavedReports]);

  if (loading) {
    return (
      <StyledDashboard>
        <ReportCard title="Carregando...">
          <StyledLoadingContainer>Carregando dados de oportunidades...</StyledLoadingContainer>
        </ReportCard>
      </StyledDashboard>
    );
  }

  return (
    <StyledDashboard>
      <StyledHeader>
        <StyledSectionTitle>Meus Relatórios</StyledSectionTitle>
        <StyledCreateButton onClick={handleCreateReport}>
          + Criar Relatório
        </StyledCreateButton>
      </StyledHeader>

      {savedReports.length === 0 ? (
        <StyledFullWidthCard>
          <ReportCard title="Bem-vindo aos Relatórios">
            <StyledLoadingContainer>
              Você ainda não tem relatórios personalizados.<br />
              Clique em "+ Criar Relatório" para começar.
            </StyledLoadingContainer>
          </ReportCard>
        </StyledFullWidthCard>
      ) : (
        <StyledSavedReportsGrid>
          {savedReports.map(report => (
            <SavedReportCard
              key={report.id}
              report={report}
              opportunities={opportunitiesData}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
            />
          ))}
        </StyledSavedReportsGrid>
      )}

      {isBuilderOpen && (
        <ReportBuilder
          opportunities={opportunitiesData}
          editingReport={editingReport}
        />
      )}
    </StyledDashboard>
  );
};

