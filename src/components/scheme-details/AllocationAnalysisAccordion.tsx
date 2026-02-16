import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Accordion } from '@/src/components/Accordion';
import { AllocationDonut } from '@/src/components/AllocationDonut';
import { colors } from '@/src/constants/theme';
import type { SchemeData } from '@/src/data/scheme';
import { t } from '@/src/locales';
import { formatPercent } from '@/src/utils/format';

const ALLOCATION_COLORS = ['#6EA98C', '#2F6DE6', '#B384F5', '#F59B3A', '#F9B26E', '#FF3F66', '#8B9DAF', '#A7C957'];

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

type AllocationAnalysisAccordionProps = {
  scheme: SchemeData;
};

export function AllocationAnalysisAccordion({ scheme }: AllocationAnalysisAccordionProps) {
  const [allocMode, setAllocMode] = useState<'asset' | 'sector'>('asset');

  const allocationLegendRows = useMemo(() => {
    const rows =
      allocMode === 'asset'
        ? scheme.holding_asset_allocation?.map((item) => ({
            name: item.asset_name ?? t('common.na'),
            value: toNumber(item.asset_percentage)
          })) ?? []
        : scheme.mf_sector_details?.map((item) => ({
            name: item.sector_name ?? t('common.na'),
            value: toNumber(item.percentage_assets)
          })) ?? [];

    return rows
      .filter((row) => row.value > 0)
      .map((row, index) => ({
        ...row,
        color: ALLOCATION_COLORS[index % ALLOCATION_COLORS.length]
      }));
  }, [allocMode, scheme.holding_asset_allocation, scheme.mf_sector_details]);

  return (
    <Accordion title={t('sections.allocationAnalysis')}>
      <View style={styles.allocationTabs}>
        <TouchableOpacity
          style={[styles.allocationTab, allocMode === 'asset' && styles.allocationTabActive]}
          onPress={() => setAllocMode('asset')}>
          <Text style={[styles.allocationTabText, allocMode === 'asset' && styles.allocationTabTextActive]}>
            {t('allocation.assetClass')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.allocationTab, allocMode === 'sector' && styles.allocationTabActive]}
          onPress={() => setAllocMode('sector')}>
          <Text style={[styles.allocationTabText, allocMode === 'sector' && styles.allocationTabTextActive]}>
            {t('allocation.sector')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.allocationContent}>
        <View style={styles.allocationDonutWrap}>
          <AllocationDonut
            segments={allocationLegendRows.map((row) => ({ value: row.value, color: row.color }))}
            size={160}
            strokeWidth={19}
          />
        </View>
        <View style={styles.allocationLegend}>
          {allocationLegendRows.map((row) => (
            <View key={row.name} style={styles.allocationLegendRow}>
              <View style={[styles.allocationLegendDot, { backgroundColor: row.color }]} />
              <Text style={styles.allocationLegendPercent}>{formatPercent(row.value, 2)}</Text>
              <Text style={styles.allocationLegendName}>{row.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </Accordion>
  );
}

const styles = StyleSheet.create({
  allocationTabs: {
    flexDirection: 'row',
    marginHorizontal: -14,
    marginTop: -6,
    borderBottomWidth: 1,
    borderBottomColor: '#d6ddd8'
  },
  allocationTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  allocationTabActive: {
    borderBottomColor: colors.primaryDark
  },
  allocationTabText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500'
  },
  allocationTabTextActive: {
    color: colors.primaryDark,
    fontWeight: '600'
  },
  allocationContent: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  allocationDonutWrap: {
    width: 170,
    alignItems: 'center',
    justifyContent: 'center'
  },
  allocationLegend: {
    flex: 1,
    gap: 12,
    paddingLeft: 2
  },
  allocationLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  allocationLegendDot: {
    width: 9,
    height: 9,
    borderRadius: 999
  },
  allocationLegendPercent: {
    width: 56,
    color: '#111827',
    fontSize: 12,
    fontWeight: '600'
  },
  allocationLegendName: {
    flex: 1,
    color: '#111827',
    fontSize: 14,
    fontWeight: '500'
  }
});
