import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { colors } from '@/src/constants/theme';
import type { SchemeData } from '@/src/data/scheme';
import { t } from '@/src/locales';
import { formatCr, formatCurrencyINR, formatDate, formatPercent } from '@/src/utils/format';

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

type HeroSectionProps = {
  scheme: SchemeData;
};

export function HeroSection({ scheme }: HeroSectionProps) {
  const headerChips = useMemo(
    () =>
      [scheme.category_name, scheme.sub_category_name, scheme.plan_type].filter(
        (item): item is string => Boolean(item && item.trim())
      ),
    [scheme.category_name, scheme.plan_type, scheme.sub_category_name]
  );

  const fundRating = Math.max(0, Math.min(5, Math.round(toNumber(scheme.fund_rating, 0))));
  const ratingStars = `${'★'.repeat(fundRating)}${'☆'.repeat(5 - fundRating)}`;

  return (
    <View style={styles.hero}>
      <View style={styles.heroTopRow}>
        <View style={styles.heroChipRow}>
          {headerChips.map((chip) => (
            <View key={chip} style={styles.heroChip}>
              <Text style={styles.heroChipText}>{chip}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Feather name="bookmark" size={20} color={colors.primaryDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.heroIdentityRow}>
        <View style={styles.heroLogo}>
          {scheme.amc_image_icons ? (
            <Image source={{ uri: scheme.amc_image_icons }} contentFit="contain" style={styles.heroLogoImage} />
          ) : (
            <Text style={styles.heroLogoText}>{(scheme.amc_full_name ?? scheme.amc_name ?? 'MF').slice(0, 3).toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.heroIdentityText}>
          <Text style={styles.heroSchemeName}>{scheme.scheme_name ?? t('common.na')}</Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{(scheme.scheme_type_ai ?? 'Resilient').toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.heroStatsGrid}>
        <View style={styles.heroStatCell}>
          <Text style={styles.heroStatLabel}>NAV : {formatDate(scheme.nav_date)}</Text>
          <View style={styles.heroNavValueRow}>
            <Text style={styles.heroStatValue}>{formatCurrencyINR(scheme.nav_value)}</Text>
            <Text style={styles.heroStatSubValue}>
              {`▲ ${scheme.per_day_nav ?? '--'} (${scheme.per_day_nav_percentage ?? '--'}%)`}
            </Text>
          </View>
        </View>
        <View style={styles.heroStatCell}>
          <Text style={styles.heroStatLabel}>{t('header.aum')}</Text>
          <Text style={styles.heroStatValue}>{formatCr(scheme.aum_value)}</Text>
        </View>
        <View style={styles.heroStatCell}>
          <Text style={styles.heroStatLabel}>1 Yr Return</Text>
          <Text style={styles.heroStatValue}>{formatPercent(scheme.one_year_return)}</Text>
        </View>
        <View style={styles.heroStatCell}>
          <Text style={styles.heroStatLabel}>Benchmark Index</Text>
          <Text style={styles.heroStatValue}>{scheme.benchmark_index_name ?? t('common.na')}</Text>
        </View>
        <View style={styles.heroStatCell}>
          <Text style={styles.heroStatLabel}>1 Yr Benchmark Return</Text>
          <Text style={styles.heroStatValue}>{formatPercent(scheme.three_month)}</Text>
        </View>
        <View style={styles.heroStatCell}>
          <Text style={styles.heroStatLabel}>Value Research Rating</Text>
          <Text style={styles.heroRating}>{ratingStars}</Text>
        </View>
      </View>

      <Text style={styles.heroDescription}>
        {`"${scheme.scheme_objective ?? scheme.scheme_description_ai ?? t('common.na')}"`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#e4ece8',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  heroChipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  heroChip: {
    borderWidth: 1,
    borderColor: '#9aa9a1',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  heroChipText: {
    color: '#26352f',
    fontSize: 13,
    fontWeight: '500'
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroIdentityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  heroLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f7f6',
    borderWidth: 1,
    borderColor: '#d3ddd8',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroLogoText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700'
  },
  heroLogoImage: {
    width: 34,
    height: 34
  },
  heroIdentityText: {
    flex: 1
  },
  heroSchemeName: {
    color: '#111827',
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '600'
  },
  heroBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#1f82cc',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  heroBadgeText: {
    color: '#eaf7ff',
    fontSize: 12,
    fontWeight: '700'
  },
  heroStatsGrid: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
    columnGap: 12
  },
  heroStatCell: {
    width: '48%',
    minHeight: 56,
    justifyContent: 'flex-start'
  },
  heroStatLabel: {
    color: '#6b7280',
    fontSize: 11,
    marginBottom: 4
  },
  heroStatValue: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600'
  },
  heroNavValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap'
  },
  heroStatSubValue: {
    color: '#53a532',
    fontSize: 11,
    fontWeight: '600'
  },
  heroRating: {
    color: '#5f9b82',
    fontSize: 16,
    letterSpacing: 1
  },
  heroDescription: {
    marginTop: 14,
    color: '#1f2937',
    fontSize: 14,
    lineHeight: 24
  }
});
