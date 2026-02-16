import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Accordion } from '@/src/components/Accordion';
import { colors } from '@/src/constants/theme';
import type { SchemeData } from '@/src/data/scheme';
import { t } from '@/src/locales';

const HOLDINGS_PREVIEW_COUNT = 4;

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

type HoldingsAnalysisAccordionProps = {
  scheme: SchemeData;
};

export function HoldingsAnalysisAccordion({ scheme }: HoldingsAnalysisAccordionProps) {
  const [showAllHoldings, setShowAllHoldings] = useState(false);

  const { visibleHoldings, canToggleHoldings } = useMemo(() => {
    const data = scheme.holdings_data ?? [];
    const visibleHoldings = showAllHoldings ? data : data.slice(0, HOLDINGS_PREVIEW_COUNT);
    const canToggleHoldings = data.length > HOLDINGS_PREVIEW_COUNT;
    return { visibleHoldings, canToggleHoldings };
  }, [scheme.holdings_data, showAllHoldings]);

  return (
    <Accordion title={t('sections.holdingsAnalysis')}>
      <View style={styles.holdingsHeader}>
        <Text style={styles.holdingsSecurityHeader}>{t('holdings.security')}</Text>
        <View style={styles.holdingsRightHeader}>
          <Text style={[styles.holdingsHeadText, styles.holdingsValueText]}>{t('holdings.value')}</Text>
          <Text style={[styles.holdingsHeadText, styles.holdingsPercentText]}>{t('holdings.holding')}</Text>
        </View>
      </View>
      {visibleHoldings.map((item) => (
        <View key={`${item.Company_names}-${item.holding_value}`} style={styles.holdingsRow}>
          <Text style={styles.holdingsSecurity}>{item.Company_names ?? t('common.na')}</Text>
          <View style={styles.holdingsRightRow}>
            <Text style={[styles.holdingsValue, styles.holdingsValueText]}>
              {`₹${Math.round(toNumber(item.holding_value) / 1000000)}`}
            </Text>
            <Text style={[styles.holdingsPercent, styles.holdingsPercentText]}>
              {toNumber(item.holdings_percentages).toFixed(1)}
            </Text>
          </View>
        </View>
      ))}
      {canToggleHoldings ? (
        <TouchableOpacity style={styles.viewAllHoldingsButton} onPress={() => setShowAllHoldings((prev) => !prev)}>
          <Text style={styles.viewAllHoldingsText}>
            {showAllHoldings ? t('holdings.viewLessHoldings') : t('common.viewAllHoldings')}
          </Text>
          <Text style={styles.viewAllHoldingsChevron}>{showAllHoldings ? '⌃' : '⌄'}</Text>
        </TouchableOpacity>
      ) : null}
    </Accordion>
  );
}

const styles = StyleSheet.create({
  holdingsHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  holdingsSecurityHeader: {
    flex: 1.35,
    color: '#9ca3af',
    fontSize: 12
  },
  holdingsRightHeader: {
    flex: 1,
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 12
  },
  holdingsHeadText: {
    color: '#9ca3af',
    fontSize: 12
  },
  holdingsRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  holdingsSecurity: {
    flex: 1.35,
    color: colors.text,
    fontSize: 15,
    lineHeight: 20
  },
  holdingsRightRow: {
    flex: 1,
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 12
  },
  holdingsValue: {
    color: '#4b5563',
    fontSize: 15
  },
  holdingsPercent: {
    color: '#4b5563',
    fontSize: 15
  },
  holdingsValueText: {
    width: 88
  },
  holdingsPercentText: {
    width: 68
  },
  viewAllHoldingsButton: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6
  },
  viewAllHoldingsText: {
    color: '#7cae95',
    fontSize: 14,
    fontWeight: '600'
  },
  viewAllHoldingsChevron: {
    color: '#7cae95',
    fontSize: 14
  }
});
