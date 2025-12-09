import styled from '@emotion/styled';
import { ReactNode } from 'react';

const StyledCard = styled.div`
  background: ${({ theme }) => theme.background.primary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: ${({ theme }) => theme.border.radius.md};
  display: flex;
  flex-direction: column;
  min-height: 350px;
`;

const StyledCardHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
`;

const StyledCardTitle = styled.h3`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin: 0;
`;

const StyledCardContent = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(4)};
`;

interface ReportCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export const ReportCard = ({ title, children, action }: ReportCardProps) => {
  return (
    <StyledCard>
      <StyledCardHeader>
        <StyledCardTitle>{title}</StyledCardTitle>
        {action}
      </StyledCardHeader>
      <StyledCardContent>{children}</StyledCardContent>
    </StyledCard>
  );
};

