import { type I18n } from '@lingui/core';
import { MainText } from 'src/components/MainText';
import { SubTitle } from 'src/components/SubTitle';

type WhatIsJusDealProps = {
  i18n: I18n;
};

export const WhatIsJusDeal = ({ i18n }: WhatIsJusDealProps) => {
  return (
    <>
      <SubTitle value={i18n._('What is JusDeal?')} />
      <MainText>
        {i18n._(
          "It's a CRM, a software to help businesses manage their customer data and relationships efficiently.",
        )}
      </MainText>
    </>
  );
};

// Alias for backward compatibility
export const WhatIsTwenty = WhatIsJusDeal;
