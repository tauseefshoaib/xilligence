import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type RiskometerProps = {
  current: string;
  levels: string[];
  disclaimer: string;
  riskSuffix: string;
};

const barColors = ['#6ea78e', '#8ed319', '#ffd400', '#ff8a00', '#ff2f65'];

function getLevelIndex(current: string, levels: string[]): number {
  const normalized = current.toLowerCase().trim();
  const exact = levels.findIndex((item) => item.toLowerCase() === normalized);
  if (exact >= 0) return exact;
  if (normalized.includes('very high')) return levels.length - 1;
  if (normalized.includes('high')) return Math.max(levels.length - 2, 0);
  if (normalized.includes('moderate')) return 2;
  if (normalized.includes('low')) return 0;
  return levels.length - 1;
}

export function Riskometer({ current, levels, disclaimer, riskSuffix }: RiskometerProps) {
  const index = getLevelIndex(current, levels);
  const selectedLabel = current?.trim() || levels[index] || '';

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {levels.map((level, idx) => (
          <View key={level} style={[styles.segment, { backgroundColor: barColors[idx] }]} />
        ))}
      </View>
      <View style={styles.labelsRow}>
        {levels.map((level) => (
          <Text key={level} style={styles.label}>
            {level}
          </Text>
        ))}
      </View>

      <Text style={styles.disclaimer}>{disclaimer}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{`${selectedLabel} ${riskSuffix}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 4
  },
  barContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    overflow: 'hidden'
  },
  segment: {
    flex: 1
  },
  labelsRow: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#111827',
    lineHeight: 16
  },
  disclaimer: {
    marginTop: 26,
    textAlign: 'center',
    color: '#374151',
    fontSize: 32 / 2,
    lineHeight: 44 / 2,
    maxWidth: 320
  },
  badge: {
    marginTop: 16,
    backgroundColor: '#ff2f65',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  badgeText: {
    color: '#fff',
    fontSize: 30 / 2,
    fontWeight: '700'
  }
});
