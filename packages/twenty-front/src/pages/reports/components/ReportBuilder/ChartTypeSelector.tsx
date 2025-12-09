import styled from '@emotion/styled';
import { ChartType, CHART_TYPES } from '../../types/ReportConfig';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledLabel = styled.label`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.font.color.secondary};
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledOption = styled.button<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(3)};
  border: 2px solid ${({ theme, isSelected }) => 
    isSelected ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  background: ${({ theme, isSelected }) => 
    isSelected ? theme.background.transparent.blue : theme.background.primary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledIcon = styled.span`
  font-size: 24px;
`;

const StyledOptionLabel = styled.span<{ isSelected: boolean }>`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme, isSelected }) => 
    isSelected ? theme.color.blue : theme.font.color.primary};
  font-weight: ${({ theme, isSelected }) => 
    isSelected ? theme.font.weight.medium : theme.font.weight.regular};
`;

// Simple icon representations
const ChartIcons: Record<ChartType, string> = {
  bar: '📊',
  horizontalBar: '📶',
  pie: '🥧',
  line: '📈',
};

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export const ChartTypeSelector = ({ value, onChange }: ChartTypeSelectorProps) => {
  return (
    <StyledContainer>
      <StyledLabel>Tipo de Gráfico</StyledLabel>
      <StyledGrid>
        {CHART_TYPES.map(chartType => (
          <StyledOption
            key={chartType.id}
            isSelected={value === chartType.id}
            onClick={() => onChange(chartType.id)}
            type="button"
          >
            <StyledIcon>{ChartIcons[chartType.id]}</StyledIcon>
            <StyledOptionLabel isSelected={value === chartType.id}>
              {chartType.label}
            </StyledOptionLabel>
          </StyledOption>
        ))}
      </StyledGrid>
    </StyledContainer>
  );
};

