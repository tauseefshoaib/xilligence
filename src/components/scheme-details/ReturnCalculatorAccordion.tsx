import React, { useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Accordion } from '@/src/components/Accordion';
import { colors } from '@/src/constants/theme';
import type { SchemeData } from '@/src/data/scheme';
import { t } from '@/src/locales';
import { calculateOneTime, calculateSip } from '@/src/utils/calculator';
import { formatCurrencyINR, formatPercent } from '@/src/utils/format';

const DURATIONS = ['1M', '3M', '6M', '1Y', '3Y', '5Y'];

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

type ReturnCalculatorAccordionProps = {
  scheme: SchemeData;
};

export function ReturnCalculatorAccordion({ scheme }: ReturnCalculatorAccordionProps) {
  const sliderRef = useRef<View>(null);

  const [calcMode, setCalcMode] = useState<'sip' | 'oneTime'>('sip');
  const [amount, setAmount] = useState<number>(scheme.min_sip_amount ?? 5000);
  const [duration, setDuration] = useState('1M');
  const [sliderWidth, setSliderWidth] = useState(0);
  const [sliderPageX, setSliderPageX] = useState(0);

  const calcYears =
    duration === '1M'
      ? 1 / 12
      : duration === '3M'
        ? 0.25
        : duration === '6M'
          ? 0.5
          : duration === '1Y'
            ? 1
            : duration === '3Y'
              ? 3
              : 5;
  const sliderMin = 100;
  const sliderMax = 100000;
  const sliderStep = 500;
  const amountNumber = clamp(toNumber(amount, sliderMin), sliderMin, sliderMax);
  const amountRatio = (amountNumber - sliderMin) / Math.max(sliderMax - sliderMin, 1);
  const thumbSize = 22;
  const usableTrackWidth = Math.max(sliderWidth - thumbSize, 0);
  const thumbLeft = Math.max(0, amountRatio * usableTrackWidth);
  const filledWidth = Math.min(sliderWidth, thumbLeft + thumbSize / 2);

  const updateAmountFromPageX = useCallback(
    (pageX: number) => {
      if (sliderWidth <= 0) return;
      const localX = pageX - sliderPageX;
      const ratio = clamp(localX / sliderWidth, 0, 1);
      const raw = sliderMin + ratio * (sliderMax - sliderMin);
      const stepped = Math.round(raw / sliderStep) * sliderStep;
      const clamped = clamp(stepped, sliderMin, sliderMax);
      setAmount((prev) => (prev === clamped ? prev : clamped));
    },
    [sliderPageX, sliderMax, sliderMin, sliderStep, sliderWidth]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) => {
          updateAmountFromPageX(event.nativeEvent.pageX);
        },
        onPanResponderMove: (_event, gestureState) => {
          updateAmountFromPageX(gestureState.moveX);
        }
      }),
    [updateAmountFromPageX]
  );

  const calcResult =
    calcMode === 'sip'
      ? calculateSip(amountNumber, calcYears)
      : calculateOneTime(amountNumber, calcYears);

  return (
    <Accordion title={t('sections.returnCalculator')}>
      <View style={styles.modeTabs}>
        <TouchableOpacity
          style={[styles.modeTab, calcMode === 'sip' && styles.modeTabActive]}
          onPress={() => setCalcMode('sip')}>
          <Text style={[styles.modeTabText, calcMode === 'sip' && styles.modeTabTextActive]}>
            {t('calculator.monthlySip')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeTab, calcMode === 'oneTime' && styles.modeTabActive]}
          onPress={() => setCalcMode('oneTime')}>
          <Text style={[styles.modeTabText, calcMode === 'oneTime' && styles.modeTabTextActive]}>
            {t('calculator.oneTime')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.amountInlineRow}>
        <Text style={styles.inputLabelInline}>
          {calcMode === 'sip' ? t('calculator.monthlyAmount') : t('calculator.oneTimeAmount')}
        </Text>
        <View style={styles.amountPill}>
          <Text style={styles.amountPillText}>{formatCurrencyINR(amountNumber)}</Text>
        </View>
      </View>
      <View
        ref={sliderRef}
        style={styles.sliderTouchArea}
        onLayout={() => {
          if (!sliderRef.current) return;
          sliderRef.current.measureInWindow((x, _y, width) => {
            setSliderPageX(x);
            setSliderWidth(width);
          });
        }}
        {...panResponder.panHandlers}>
        <View style={styles.sliderTrack} />
        <View style={[styles.sliderFilled, { width: filledWidth }]} />
        <View style={[styles.sliderThumb, { left: thumbLeft }]} />
      </View>

      <Text style={styles.inputLabel}>{t('calculator.duration')}</Text>
      <View style={styles.durationRow}>
        {DURATIONS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.durationChip, duration === item && styles.durationChipActive]}
            onPress={() => setDuration(item)}>
            <Text style={[styles.durationText, duration === item && styles.durationTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.calculatorResult}>
        <Text style={styles.calcLine}>{`${t('calculator.totalInvestment')}  ${formatCurrencyINR(calcResult.invested)}`}</Text>
        <Text style={styles.calcLineStrong}>
          {`${t('calculator.wouldHaveBecome')} `}
          <Text style={styles.calcLineStrongValue}>{`${formatCurrencyINR(calcResult.estimated)} (${formatPercent(calcResult.gainPercent)})`}</Text>
        </Text>
      </View>
    </Accordion>
  );
}

const styles = StyleSheet.create({
  modeTabs: {
    flexDirection: 'row',
    gap: 12
  },
  modeTab: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: '#dce3e0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13
  },
  modeTabActive: {
    backgroundColor: colors.primary
  },
  modeTabText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600'
  },
  modeTabTextActive: {
    color: '#ffffff'
  },
  inputLabelInline: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '500'
  },
  inputLabel: {
    marginTop: 18,
    marginBottom: 8,
    color: '#111827',
    fontSize: 13,
    fontWeight: '500'
  },
  amountInlineRow: {
    marginTop: 12,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  amountPill: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 9
  },
  amountPillText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13
  },
  sliderTouchArea: {
    position: 'relative',
    height: 34,
    justifyContent: 'center',
    marginTop: 6
  },
  sliderTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#d7ddea'
  },
  sliderFilled: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.primary
  },
  sliderThumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1.2,
    borderColor: '#d7ddea',
    top: 6
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  durationChip: {
    width: '15.5%',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff'
  },
  durationChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  durationText: {
    color: colors.muted,
    fontSize: 12
  },
  durationTextActive: {
    color: '#fff'
  },
  calculatorResult: {
    marginTop: 14,
    marginHorizontal: -12,
    marginBottom: -12,
    backgroundColor: '#eceff3',
    paddingTop: 14,
    paddingBottom: 14,
    gap: 4,
    alignItems: 'center'
  },
  calcLine: {
    color: colors.text,
    fontSize: 12,
    textAlign: 'center'
  },
  calcLineStrong: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center'
  },
  calcLineStrongValue: {
    color: colors.success
  }
});
