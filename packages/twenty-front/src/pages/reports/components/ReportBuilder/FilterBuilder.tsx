import styled from '@emotion/styled';
import { v4 as uuidv4 } from 'uuid';
import { ReportFilter, FILTER_FIELDS, FilterOperator, OPERATORS_BY_TYPE } from '../../types/ReportConfig';

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

const StyledFilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledFilterItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  background: ${({ theme }) => theme.background.secondary};
`;

const StyledFilterRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: center;
`;

const StyledSelect = styled.select`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-size: ${({ theme }) => theme.font.size.sm};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing(1.5)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-size: ${({ theme }) => theme.font.size.sm};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledCheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledCheckboxLabel = styled.label<{ checked: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(2)}`};
  border: 1px solid ${({ theme, checked }) => checked ? theme.color.blue : theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  background: ${({ theme, checked }) => checked ? theme.color.blue + '20' : theme.background.primary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.size.sm};

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledRemoveButton = styled.button`
  padding: ${({ theme }) => theme.spacing(1)};
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.red};
  cursor: pointer;
  font-size: 18px;

  &:hover { opacity: 0.8; }
`;

const StyledAddButton = styled.button`
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px dashed ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.font.color.secondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.size.sm};

  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
    color: ${({ theme }) => theme.color.blue};
  }
`;

interface FilterBuilderProps {
  filters: ReportFilter[];
  onChange: (filters: ReportFilter[]) => void;
}

export const FilterBuilder = ({ filters, onChange }: FilterBuilderProps) => {
  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: uuidv4(),
      field: 'stage',
      operator: 'in',
      value: [],
    };
    onChange([...filters, newFilter]);
  };

  const updateFilter = (id: string, updates: Partial<ReportFilter>) => {
    onChange(filters.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFilter = (id: string) => {
    onChange(filters.filter(f => f.id !== id));
  };

  const getFieldDef = (fieldId: string) => {
    return FILTER_FIELDS.find(f => f.id === fieldId);
  };

  const getFieldOptions = (fieldId: string) => {
    const field = getFieldDef(fieldId);
    return field?.options || [];
  };

  const getOperatorsForField = (fieldId: string) => {
    const field = getFieldDef(fieldId);
    const fieldType = field?.type || 'string';
    return OPERATORS_BY_TYPE[fieldType] || OPERATORS_BY_TYPE.string;
  };

  const handleMultiselectChange = (filterId: string, optionValue: string, currentValue: string[] | string) => {
    const currentArray = Array.isArray(currentValue) ? currentValue : [];
    const newValue = currentArray.includes(optionValue)
      ? currentArray.filter(v => v !== optionValue)
      : [...currentArray, optionValue];
    updateFilter(filterId, { value: newValue });
  };

  const renderValueInput = (filter: ReportFilter) => {
    const fieldDef = getFieldDef(filter.field);
    const options = getFieldOptions(filter.field);

    // Multiselect for stage (checkboxes)
    if (fieldDef?.type === 'multiselect' && options.length > 0) {
      const selectedValues: string[] = Array.isArray(filter.value) ? filter.value as string[] : [];
      return (
        <StyledCheckboxGroup>
          {options.map(opt => (
            <StyledCheckboxLabel
              key={opt.value}
              checked={selectedValues.includes(opt.value)}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(opt.value)}
                onChange={() => handleMultiselectChange(filter.id, opt.value, filter.value as string[])}
              />
              {opt.label}
            </StyledCheckboxLabel>
          ))}
        </StyledCheckboxGroup>
      );
    }

    // Select for single-value options
    if (options.length > 0) {
      return (
        <StyledSelect
          value={filter.value as string}
          onChange={e => updateFilter(filter.id, { value: e.target.value })}
        >
          <option value="">Selecione...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </StyledSelect>
      );
    }

    // Input for text/number/date
    return (
      <StyledInput
        type={filter.field === 'amount' ? 'number' :
              filter.field.includes('Date') || filter.field === 'createdAt' ? 'date' : 'text'}
        value={filter.value as string}
        onChange={e => updateFilter(filter.id, { value: e.target.value })}
        placeholder="Valor..."
      />
    );
  };

  return (
    <StyledContainer>
      <StyledLabel>Filtros</StyledLabel>
      <StyledFilterList>
        {filters.map(filter => (
          <StyledFilterItem key={filter.id}>
            <StyledFilterRow>
              <StyledSelect
                value={filter.field}
                onChange={e => {
                  const newField = e.target.value;
                  const newFieldDef = getFieldDef(newField);
                  const defaultOperator = newFieldDef?.type === 'multiselect' ? 'in' : 'equals';
                  const defaultValue = newFieldDef?.type === 'multiselect' ? [] : '';
                  updateFilter(filter.id, { field: newField, operator: defaultOperator, value: defaultValue });
                }}
              >
                {FILTER_FIELDS.map(field => (
                  <option key={field.id} value={field.id}>{field.label}</option>
                ))}
              </StyledSelect>
              <StyledRemoveButton onClick={() => removeFilter(filter.id)}>×</StyledRemoveButton>
            </StyledFilterRow>
            <StyledFilterRow>
              <StyledSelect
                value={filter.operator}
                onChange={e => updateFilter(filter.id, { operator: e.target.value as FilterOperator })}
              >
                {getOperatorsForField(filter.field).map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </StyledSelect>
            </StyledFilterRow>
            <StyledFilterRow>
              {renderValueInput(filter)}
            </StyledFilterRow>
          </StyledFilterItem>
        ))}
        <StyledAddButton onClick={addFilter}>+ Adicionar Filtro</StyledAddButton>
      </StyledFilterList>
    </StyledContainer>
  );
};

