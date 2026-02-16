import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/theme';

type Item = {
  label: string;
  value: string;
};

type InfoGridProps = {
  items: Item[];
};

export function InfoGrid({ items }: InfoGridProps) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.cell}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  cell: {
    width: '50%',
    paddingBottom: 10
  },
  label: {
    color: colors.muted,
    fontSize: 11
  },
  value: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 12,
    marginTop: 2
  }
});
