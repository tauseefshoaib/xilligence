import React, { useMemo } from 'react';

import { Accordion } from '@/src/components/Accordion';
import { Riskometer } from '@/src/components/Riskometer';
import type { SchemeData } from '@/src/data/scheme';
import { t } from '@/src/locales';

type RiskometerAccordionProps = {
  scheme: SchemeData;
};

export function RiskometerAccordion({ scheme }: RiskometerAccordionProps) {
  const riskLevels = useMemo(
    () => [
      t('riskometer.low'),
      t('riskometer.lowModerate'),
      t('riskometer.moderate'),
      t('riskometer.moderatelyHigh'),
      t('riskometer.veryHigh')
    ],
    []
  );

  const currentRiskValue = scheme.riskometer_value ?? scheme.colour_name ?? t('riskometer.veryHigh');

  return (
    <Accordion title={t('sections.riskometer')}>
      <Riskometer
        current={currentRiskValue}
        levels={riskLevels}
        disclaimer={t('riskometer.disclaimer')}
        riskSuffix={t('riskometer.riskSuffix')}
      />
    </Accordion>
  );
}
