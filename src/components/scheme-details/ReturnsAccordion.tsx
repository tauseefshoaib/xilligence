import React, { useMemo, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Accordion } from "@/src/components/Accordion";
import { NavGraph } from "@/src/components/NavGraph";
import { colors } from "@/src/constants/theme";
import type { SchemeData } from "@/src/data/scheme";
import { t } from "@/src/locales";
import { formatCurrencyINR, formatPercent } from "@/src/utils/format";

type ReturnsAccordionProps = {
  scheme: SchemeData;
  onGraphDragChange?: (isDragging: boolean) => void;
  onOneTimePress?: () => void;
  onStartSipPress?: () => void;
};

export function ReturnsAccordion({
  scheme,
  onGraphDragChange,
  onOneTimePress,
  onStartSipPress,
}: ReturnsAccordionProps) {
  const graphWidth = Math.min(Dimensions.get("window").width - 50, 390);
  const durationOptions = useMemo(() => {
    const fromSchema = (scheme.scheme_duration ?? [])
      .map((item) => item.duration)
      .filter((item): item is string => Boolean(item))
      .map((item) => item.toUpperCase());
    const ordered = ["1M", "3M", "6M", "1Y", "3Y", "MAX"];
    return ordered.filter((item) => fromSchema.includes(item));
  }, [scheme.scheme_duration]);

  const [selectedDuration, setSelectedDuration] = useState<string>(
    durationOptions.includes("1Y") ? "1Y" : (durationOptions[0] ?? "MAX"),
  );

  const selectedDurationMeta = useMemo(
    () =>
      (scheme.scheme_duration ?? []).find(
        (item) => (item.duration ?? "").toUpperCase() === selectedDuration,
      ),
    [scheme.scheme_duration, selectedDuration],
  );

  const graphData = useMemo(() => {
    const all = scheme.nav_json ?? [];
    if (
      selectedDuration === "MAX" ||
      !selectedDurationMeta?.duration_value ||
      all.length === 0
    )
      return all;
    const lastPoint = all[all.length - 1];
    if (!lastPoint?.nav_date) return all;
    const end = new Date(lastPoint.nav_date);
    if (Number.isNaN(end.getTime())) return all;
    const start = new Date(end);
    start.setDate(start.getDate() - selectedDurationMeta.duration_value);
    return all.filter((point) => {
      if (!point.nav_date) return false;
      const d = new Date(point.nav_date);
      return !Number.isNaN(d.getTime()) && d >= start;
    });
  }, [scheme.nav_json, selectedDuration, selectedDurationMeta?.duration_value]);

  const oneTimeFrequencySuffix = useMemo(() => {
    const raw = (scheme.scheme_sip_freequency ?? "").toUpperCase();
    if (raw === "DAILY" || raw === "DAY") return "/day";
    if (raw === "WEEKLY") return "/week";
    if (raw === "MONTHLY") return "/month";
    if (raw === "QUARTERLY") return "/quarter";
    return "";
  }, [scheme.scheme_sip_freequency]);

  return (
    <Accordion title={t("sections.returns")}>
      <View style={styles.metricRow}>
        <Text style={styles.metricValue}>
          {formatPercent(selectedDurationMeta?.NAV ?? scheme.one_year_return)}
        </Text>
        <Text style={styles.metricLabel}>{`${selectedDuration} return`}</Text>
      </View>
      <NavGraph
        data={graphData}
        width={graphWidth}
        height={300}
        onGestureStart={() => onGraphDragChange?.(true)}
        onGestureEnd={() => onGraphDragChange?.(false)}
      />
      <View style={styles.durationRow}>
        {durationOptions.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.durationChip,
              item === selectedDuration && styles.durationChipActive,
            ]}
            onPress={() => setSelectedDuration(item)}
          >
            <Text
              style={[
                styles.durationChipText,
                item === selectedDuration && styles.durationChipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.minRow}>
        <View style={[styles.minCell, styles.minCellLeft]}>
          <Text style={styles.minLabel}>Min One Time Amount</Text>
          <Text style={styles.minValue}>
            {formatCurrencyINR(
              scheme.min_lumpsum_amount ?? scheme.min_investment,
            )}
          </Text>
        </View>
        <View style={[styles.minCell, styles.minCellRight]}>
          <Text style={[styles.minLabel, styles.minTextRight]}>
            Min SIP Amount
          </Text>
          <Text
            style={[styles.minValue, styles.minTextRight]}
          >{`${formatCurrencyINR(scheme.min_sip_amount)}${oneTimeFrequencySuffix}`}</Text>
        </View>
      </View>
    </Accordion>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
  },
  metricRow: {
    marginTop: 6,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  metricValue: {
    color: "#5f9b82",
    fontSize: 35 / 2,
    fontWeight: "700",
  },
  metricLabel: {
    color: "#64748b",
    fontSize: 15,
  },
  durationRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  durationChip: {
    width: "15.5%",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dce3ea",
    backgroundColor: "#f5f8fb",
  },
  durationChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  durationChipText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  durationChipTextActive: {
    color: "#ffffff",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  returnActionRow: {
    marginTop: 12,
  },
  ghostButton: {
    flex: 1,
    backgroundColor: "#c7d6cf",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  ghostText: {
    color: "#6aa889",
    fontSize: 13,
    fontWeight: "600",
  },
  primaryText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  minRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginHorizontal: 10,
  },
  minCell: {
    flex: 1,
    marginTop: 10,
  },
  minCellLeft: {
    alignItems: "flex-start",
  },
  minCellRight: {
    alignItems: "flex-end",
  },
  minTextRight: {
    textAlign: "right",
  },
  minLabel: {
    color: "#7c8aa5",
    fontSize: 10,
  },
  minValue: {
    marginTop: 4,
    color: "#0f172a",
    fontSize: 36 / 2,
    fontWeight: "700",
  },
});
