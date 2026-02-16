import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Accordion } from '@/src/components/Accordion';
import { colors } from '@/src/constants/theme';
import type { SchemeData } from '@/src/data/scheme';
import { t } from '@/src/locales';

const ANALYTICS_ICON_MAP: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  beta: 'activity',
  alpha: 'target',
  pescore: 'pie-chart',
  plan_id: 'hash',
  treynor: 'trending-up',
  rsquared: 'trending-up',
  isin_code: 'bookmark',
  as_on_date: 'calendar',
  Drawdown_1Y: 'arrow-down-circle',
  Drawdown_3Y: 'arrow-up-circle',
  sharpe_ratio: 'percent',
  sortino_ratio: 'shield',
  DividendYield_1Y: 'bar-chart-2',
  DividendYield_3Y: 'bar-chart-2',
  information_ratio: 'shield',
  standard_deviation: 'bar-chart-2'
};

const ANALYTICS_DESC_MAP: Record<string, string> = {
  beta: 'Slightly less volatile than the market',
  alpha: 'Reflects how much a fund has outperformed its benchmark.',
  sharpe_ratio: 'Strong risk-adjusted returns.',
  sortino_ratio: 'Downside-risk adjusted return profile.',
  information_ratio: 'Consistency in generating alpha over benchmark.',
  standard_deviation: 'Volatility measure compared to peers.',
  Drawdown_1Y: 'Measures downside movement over 1 year.',
  Drawdown_3Y: 'Measures downside movement over 3 years.'
};

const ANALYTICS_PERCENT_KEYS = new Set(['standard_deviation', 'Drawdown_1Y', 'Drawdown_3Y', 'DividendYield_1Y', 'DividendYield_3Y']);

function formatAnalyticsKey(rawKey: string): string {
  const withSpaces = rawKey
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
  const normalized = withSpaces.length ? withSpaces : rawKey;
  return normalized
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

type AnalyticsAccordionProps = {
  scheme: SchemeData;
};

export function AnalyticsAccordion({ scheme }: AnalyticsAccordionProps) {
  const analyticsCards = useMemo(() => {
    return Object.entries(scheme.analytics_data ?? {}).map(([key, rawValue]) => {
      const value = rawValue === undefined || rawValue === null || rawValue === '' ? t('common.na') : String(rawValue);
      const finalValue =
        ANALYTICS_PERCENT_KEYS.has(key) && value !== t('common.na') && !value.includes('%') ? `${value}%` : value;

      return {
        key,
        icon: ANALYTICS_ICON_MAP[key] ?? 'activity',
        title: `${formatAnalyticsKey(key)}: ${finalValue}`,
        description: ANALYTICS_DESC_MAP[key] ?? 'Scheme analytics metric for performance and risk evaluation.'
      };
    });
  }, [scheme.analytics_data]);

  return (
    <Accordion title={t('sections.analytics')}>
      <View style={styles.analyticsList}>
        {analyticsCards.length === 0 ? (
          <Text style={styles.analyticsEmpty}>{t('common.na')}</Text>
        ) : (
          analyticsCards.map((item) => (
            <View key={item.key} style={styles.analyticsInsightRow}>
              <View style={styles.analyticsIconWrap}>
                <Feather name={item.icon} size={18} color={colors.primaryDark} />
              </View>
              <View style={styles.analyticsTextWrap}>
                <Text style={styles.analyticsInsightTitle}>{item.title}</Text>
                <Text style={styles.analyticsInsightDesc}>{item.description}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </Accordion>
  );
}

const styles = StyleSheet.create({
  analyticsList: {
    marginTop: 2,
    gap: 12
  },
  analyticsInsightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  analyticsIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8eeeb',
    alignItems: 'center',
    justifyContent: 'center'
  },
  analyticsTextWrap: {
    flex: 1,
    paddingTop: 1
  },
  analyticsInsightTitle: {
    color: '#111827',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600'
  },
  analyticsInsightDesc: {
    marginTop: 2,
    color: '#4b5563',
    fontSize: 12,
    lineHeight: 17
  },
  analyticsEmpty: {
    color: colors.muted,
    fontSize: 13
  }
});
