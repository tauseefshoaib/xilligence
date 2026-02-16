import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/src/constants/theme';

type SegmentedControlProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = option === value;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.option, active && styles.optionActive]}
            onPress={() => onChange(option)}>
            <Text style={[styles.label, active && styles.labelActive]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#e9efeb',
    borderRadius: 10,
    padding: 3,
    gap: 6
  },
  option: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionActive: {
    backgroundColor: colors.primary
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500'
  },
  labelActive: {
    color: '#ffffff'
  }
});
