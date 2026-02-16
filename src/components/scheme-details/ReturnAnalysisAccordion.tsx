import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Accordion } from '@/src/components/Accordion';
import { colors } from '@/src/constants/theme';
import type { SchemeData } from '@/src/data/scheme';
import { t } from '@/src/locales';
import { formatPercent } from '@/src/utils/format';

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

function getNiceStep(value: number): number {
  const safe = Math.max(value, 0.1);
  const exponent = Math.floor(Math.log10(safe));
  const fraction = safe / 10 ** exponent;
  let niceFraction = 1;
  if (fraction <= 1) niceFraction = 1;
  else if (fraction <= 2) niceFraction = 2;
  else if (fraction <= 5) niceFraction = 5;
  else niceFraction = 10;
  return niceFraction * 10 ** exponent;
}

type ReturnAnalysisAccordionProps = {
  scheme: SchemeData;
};

export function ReturnAnalysisAccordion({ scheme }: ReturnAnalysisAccordionProps) {
  const [returnsMode, setReturnsMode] = useState<'point' | 'sip'>('point');

  const { chartValues, returnTicks, returnScaleMin, returnScaleMax } = useMemo(() => {
    const returnRows = returnsMode === 'sip' ? scheme.sip_returns ?? [] : scheme.lumpsum_return ?? [];
    const chartValues = returnRows.map((item) => ({
      label: item.month,
      value: toNumber(item.percentage)
    }));

    const validReturnValues = chartValues.map((item) => item.value).filter((value) => Number.isFinite(value));
    const rawMin = validReturnValues.length > 0 ? Math.min(...validReturnValues) : 0;
    const rawMax = validReturnValues.length > 0 ? Math.max(...validReturnValues) : 1;
    const paddedMin = Math.max(0, rawMin - 1);
    const paddedMax = rawMax + 1;
    const roughStep = (paddedMax - paddedMin) / 6;
    const step = getNiceStep(roughStep);
    const returnScaleMin = Math.floor(paddedMin / step) * step;
    const returnScaleMax = Math.ceil(paddedMax / step) * step;

    const returnTicks: number[] = [];
    for (let current = returnScaleMax; current >= returnScaleMin; current -= step) {
      returnTicks.push(Number(current.toFixed(2)));
    }

    return { chartValues, returnTicks, returnScaleMin, returnScaleMax };
  }, [returnsMode, scheme.lumpsum_return, scheme.sip_returns]);

  const returnBarMaxHeight = 170;

  return (
    <Accordion title={t('sections.returnAnalysis')}>
      <View style={styles.returnTabs}>
        <TouchableOpacity
          style={[styles.returnTab, returnsMode === 'point' && styles.returnTabActive]}
          onPress={() => setReturnsMode('point')}>
          <Text style={[styles.returnTabText, returnsMode === 'point' && styles.returnTabTextActive]}>
            {t('returns.pointToPoint')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.returnTab, returnsMode === 'sip' && styles.returnTabActive]}
          onPress={() => setReturnsMode('sip')}>
          <Text style={[styles.returnTabText, returnsMode === 'sip' && styles.returnTabTextActive]}>
            {t('returns.sipReturns')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.returnChartContainer}>
        <View style={styles.returnYAxis}>
          {returnTicks.map((tick) => (
            <Text key={tick} style={styles.returnYAxisText}>{`${tick}%`}</Text>
          ))}
        </View>
        <View style={styles.returnBarsWrap}>
          {chartValues.map((item) => {
            const clampedValue = Math.max(returnScaleMin, Math.min(returnScaleMax, item.value));
            const barHeight =
              ((clampedValue - returnScaleMin) / Math.max(returnScaleMax - returnScaleMin, 1)) * returnBarMaxHeight;
            return (
              <View key={item.label} style={styles.returnBarItem}>
                <Text style={styles.returnBarValue}>{formatPercent(item.value, 0)}</Text>
                <View style={[styles.returnBar, { height: Math.max(barHeight, 6) }]} />
                <Text style={styles.returnBarLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </Accordion>
  );
}

const styles = StyleSheet.create({
  returnTabs: {
    flexDirection: 'row',
    gap: 10
  },
  returnTab: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#d7dfdb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  returnTabActive: {
    backgroundColor: colors.primary
  },
  returnTabText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '600'
  },
  returnTabTextActive: {
    color: '#ffffff'
  },
  returnChartContainer: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  returnYAxis: {
    height: 230,
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 28
  },
  returnYAxisText: {
    color: '#6b7280',
    fontSize: 10
  },
  returnBarsWrap: {
    flex: 1,
    height: 230,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 14
  },
  returnBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  returnBarValue: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 8
  },
  returnBar: {
    width: 42,
    backgroundColor: '#72a88c'
  },
  returnBarLabel: {
    marginTop: 8,
    color: '#4b5563',
    fontSize: 12
  }
});
