import styled from '@emotion/styled';
import { ReportConfig } from '../types/ReportConfig';
import { Opportunity } from './ReportsDashboard';
import { ReportPreview } from './ReportBuilder/ReportPreview';

const StyledCard = styled.div`
  background: ${({ theme }) => theme.background.primary};
  border-radius: ${({ theme }) => theme.border.radius.md};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 350px;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
`;

const StyledTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledButton = styled.button`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  background: none;
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.size.sm};
  
  &:hover {
    background: ${({ theme }) => theme.background.tertiary};
    color: ${({ theme }) => theme.font.color.primary};
  }
`;

const StyledDeleteButton = styled(StyledButton)`
  &:hover {
    background: ${({ theme }) => theme.color.red};
    border-color: ${({ theme }) => theme.color.red};
    color: white;
  }
`;

const StyledChartContainer = styled.div`
  flex: 1;
  min-height: 300px;
  height: 320px;
  padding: ${({ theme }) => theme.spacing(2)};
`;

interface SavedReportCardProps {
  report: ReportConfig;
  opportunities: Opportunity[];
  onEdit: (report: ReportConfig) => void;
  onDelete: (reportId: string) => void;
}

export const SavedReportCard = ({ 
  report, 
  opportunities, 
  onEdit, 
  onDelete 
}: SavedReportCardProps) => {
  return (
    <StyledCard>
      <StyledHeader>
        <StyledTitle>{report.name}</StyledTitle>
        <StyledActions>
          <StyledButton onClick={() => onEdit(report)}>Editar</StyledButton>
          <StyledDeleteButton onClick={() => onDelete(report.id)}>Excluir</StyledDeleteButton>
        </StyledActions>
      </StyledHeader>
      <StyledChartContainer>
        <ReportPreview config={report} opportunities={opportunities} />
      </StyledChartContainer>
    </StyledCard>
  );
};

