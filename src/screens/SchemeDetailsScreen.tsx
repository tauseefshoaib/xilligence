import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AllocationAnalysisAccordion } from "@/src/components/scheme-details/AllocationAnalysisAccordion";
import { AnalyticsAccordion } from "@/src/components/scheme-details/AnalyticsAccordion";
import { FundManagerAccordion } from "@/src/components/scheme-details/FundManagerAccordion";
import { HeroSection } from "@/src/components/scheme-details/HeroSection";
import { HoldingsAnalysisAccordion } from "@/src/components/scheme-details/HoldingsAnalysisAccordion";
import { ReturnAnalysisAccordion } from "@/src/components/scheme-details/ReturnAnalysisAccordion";
import { ReturnCalculatorAccordion } from "@/src/components/scheme-details/ReturnCalculatorAccordion";
import { ReturnsAccordion } from "@/src/components/scheme-details/ReturnsAccordion";
import { RiskometerAccordion } from "@/src/components/scheme-details/RiskometerAccordion";
import { SchemeInfoAccordion } from "@/src/components/scheme-details/SchemeInfoAccordion";
import { colors } from "@/src/constants/theme";
import { getSchemeData } from "@/src/data/scheme";
import { t } from "@/src/locales";

export function SchemeDetailsScreen() {
  const scheme = useMemo(() => getSchemeData(), []);
  const [isDraggingGraph, setIsDraggingGraph] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        scrollEnabled={!isDraggingGraph}
      >
        <Text style={styles.screenTitle}>{t("app.title")}</Text>
        <HeroSection scheme={scheme} />
        <ReturnsAccordion
          scheme={scheme}
          onGraphDragChange={setIsDraggingGraph}
        />
        <ReturnAnalysisAccordion scheme={scheme} />
        <AnalyticsAccordion scheme={scheme} />
        <AllocationAnalysisAccordion scheme={scheme} />
        <HoldingsAnalysisAccordion scheme={scheme} />
        <RiskometerAccordion scheme={scheme} />
        <SchemeInfoAccordion scheme={scheme} />
        <FundManagerAccordion scheme={scheme} />
        <ReturnCalculatorAccordion scheme={scheme} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  screenTitle: {
    textAlign: "center",
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
});
