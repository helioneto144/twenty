import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import styled from '@emotion/styled';
import { useLingui } from '@lingui/react/macro';
import { ReportsDashboard } from './components/ReportsDashboard';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const StyledHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  height: 56px;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing(4)};
`;

const StyledTitle = styled.h1`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin: 0;
`;

export const ReportsPage = () => {
  const { t } = useLingui();

  return (
    <PageContainer>
      <PageTitle title={t`Relatórios`} />
      <StyledContainer>
        <StyledHeader>
          <StyledTitle>{t`Relatórios de Oportunidades`}</StyledTitle>
        </StyledHeader>
        <ReportsDashboard />
      </StyledContainer>
    </PageContainer>
  );
};

