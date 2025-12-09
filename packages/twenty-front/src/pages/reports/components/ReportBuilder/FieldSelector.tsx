import styled from '@emotion/styled';
import { FieldDefinition } from '../../types/ReportConfig';

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

interface FieldSelectorProps {
  label: string;
  fields: FieldDefinition[];
  value: string;
  onChange: (value: string) => void;
}

export const FieldSelector = ({ label, fields, value, onChange }: FieldSelectorProps) => {
  return (
    <StyledContainer>
      <StyledLabel>{label}</StyledLabel>
      <StyledSelect
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {fields.map(field => (
          <option key={field.id} value={field.id}>
            {field.label}
          </option>
        ))}
      </StyledSelect>
    </StyledContainer>
  );
};

