import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Accordion } from '@/src/components/Accordion';
import { colors } from '@/src/constants/theme';
import type { SchemeData } from '@/src/data/scheme';
import { t } from '@/src/locales';

function formatManagerExperience(startDate?: string): string {
  if (!startDate) return t('common.na');
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return t('common.na');

  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const monthDelta = now.getMonth() - start.getMonth();
  const dayDelta = now.getDate() - start.getDate();
  if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) {
    years -= 1;
  }

  const startLabel = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const experienceLabel = years <= 0 ? '0 years' : `${years} years`;
  return `${startLabel} - Present | ${experienceLabel}`;
}

function getInitials(name?: string): string {
  if (!name) return 'NA';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

type FundManagerAccordionProps = {
  scheme: SchemeData;
};

export function FundManagerAccordion({ scheme }: FundManagerAccordionProps) {
  return (
    <Accordion title={t('sections.fundManager')}>
      {(scheme.fund_managers ?? []).map((manager) => (
        <View key={`${manager.person_name}-${manager.date_from}`} style={styles.managerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(manager.person_name)}</Text>
          </View>
          <View>
            <Text style={styles.managerName}>{manager.person_name ?? t('common.na')}</Text>
            <Text style={styles.mutedSmall}>{formatManagerExperience(manager.date_from)}</Text>
          </View>
        </View>
      ))}
    </Accordion>
  );
}

const styles = StyleSheet.create({
  managerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#a5b4fc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700'
  },
  managerName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600'
  },
  mutedSmall: {
    color: colors.muted,
    fontSize: 11
  }
});
