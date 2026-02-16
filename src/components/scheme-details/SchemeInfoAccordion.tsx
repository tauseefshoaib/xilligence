import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Accordion } from '@/src/components/Accordion';
import { colors } from '@/src/constants/theme';
import type { SchemeData } from '@/src/data/scheme';
import { t } from '@/src/locales';
import { formatCr, formatDate, formatPercent } from '@/src/utils/format';

type SchemeInfoAccordionProps = {
  scheme: SchemeData;
};

type InfoItem = {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
};

export function SchemeInfoAccordion({ scheme }: SchemeInfoAccordionProps) {
  const lockIn =
    !scheme.lock_in_period || scheme.lock_in_period === '0'
      ? 'Nil'
      : `${scheme.lock_in_period} days`;
  const exitLoad = scheme.exit_load && scheme.exit_load.trim() ? scheme.exit_load : 'Applicable';
  const contactParts = [
    scheme.amc_address1,
    scheme.amc_address2,
    scheme.amc_address3,
    scheme.amc_address4,
    scheme.amc_address5
  ]
    .filter((part): part is string => Boolean(part && part.trim()))
    .map((part) => part.trim());
  const contactAddress = contactParts.length ? contactParts.join(' ') : t('common.na');
  const contactPhone = scheme.amc_phone && scheme.amc_phone.trim() ? `Tel no.: ${scheme.amc_phone}` : '';

  const infoItems: InfoItem[] = [
    { icon: 'pie-chart', label: 'Expense Ratio', value: `${formatPercent(scheme.expense_ratio)} (inclusive of GST)` },
    { icon: 'pie-chart', label: 'AUM', value: formatCr(scheme.aum_value) },
    { icon: 'lock', label: 'Lock-in Period', value: lockIn },
    { icon: 'check-square', label: 'Benchmark', value: scheme.benchmark_index_name ?? t('common.na') },
    { icon: 'log-out', label: 'Exit Load', value: exitLoad },
    { icon: 'calendar', label: 'Listing Date', value: formatDate(scheme.listing_date) },
    { icon: 'home', label: 'AMC', value: scheme.amc_name ?? t('common.na') },
    { icon: 'folder', label: 'RTA', value: scheme.rta ?? t('common.na') }
  ];

  return (
    <Accordion title={t('sections.schemeInfo')}>
      <Text style={styles.objectiveText}>
        <Text style={styles.objectiveTitle}>Objective:</Text> {scheme.scheme_objective ?? t('common.na')}
      </Text>

      <View style={styles.grid}>
        {infoItems.map((item) => (
          <View key={item.label} style={styles.cell}>
            <View style={styles.labelRow}>
              <Feather name={item.icon} size={16} color={colors.primary} />
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.contactWrap}>
        <View style={styles.labelRow}>
          <Feather name="id-card" size={16} color={colors.primary} />
          <Text style={styles.label}>Contact Details</Text>
        </View>
        <Text style={styles.contactText}>{contactAddress}</Text>
        {contactPhone ? <Text style={styles.contactText}>{contactPhone}</Text> : null}
      </View>
    </Accordion>
  );
}

const styles = StyleSheet.create({
  objectiveText: {
    color: '#111827',
    fontSize: 12,
    lineHeight: 20
  },
  objectiveTitle: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700'
  },
  grid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16
  },
  cell: {
    width: '50%',
    paddingRight: 10
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  label: {
    color: '#6b7280',
    fontSize: 11,
    lineHeight: 16
  },
  value: {
    marginTop: 4,
    marginLeft: 24,
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18
  },
  contactWrap: {
    marginTop: 12
  },
  contactText: {
    marginTop: 4,
    marginLeft: 24,
    color: '#111827',
    fontSize: 12,
    lineHeight: 18
  }
});
