import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Canvas, LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';

import type { NavPoint } from '@/src/data/scheme';
import { colors } from '@/src/constants/theme';

type NavGraphProps = {
  data: NavPoint[];
  width: number;
  height?: number;
  onGestureStart?: () => void;
  onGestureEnd?: () => void;
};

type Point = {
  x: number;
  y: number;
};

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function downsample(points: NavPoint[], maxPoints = 140): NavPoint[] {
  if (points.length <= maxPoints) return points;
  const step = Math.ceil(points.length / maxPoints);
  return points.filter((_, idx) => idx % step === 0 || idx === points.length - 1);
}

function smoothPath(points: Point[]) {
  const path = Skia.Path.Make();
  if (points.length === 0) return path;

  path.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    path.quadTo(prev.x, prev.y, midX, midY);
  }

  const last = points[points.length - 1];
  path.lineTo(last.x, last.y);
  return path;
}

export function NavGraph({ data, width, height = 190, onGestureStart, onGestureEnd }: NavGraphProps) {
  const tooltipWidth = 170;
  const tooltipPadding = 8;
  const { strokePath, fillPath, points, graphData } = useMemo(() => {
    const graphData = downsample(data).filter((item) => Number.isFinite(toNumber(item.nav)));

    if (graphData.length === 0) {
      return { strokePath: Skia.Path.Make(), fillPath: Skia.Path.Make(), points: [] as Point[], graphData: [] as NavPoint[] };
    }

    const navValues = graphData.map((item) => toNumber(item.nav));
    const min = Math.min(...navValues);
    const max = Math.max(...navValues);
    const yRange = max - min || 1;

    const padding = 12;
    const graphHeight = height - padding * 2;
    const graphWidth = Math.max(width - padding * 2, 1);

    const points: Point[] = graphData.map((item, index) => {
      const x = padding + (index / Math.max(graphData.length - 1, 1)) * graphWidth;
      const normalized = (toNumber(item.nav) - min) / yRange;
      const y = height - padding - normalized * graphHeight;
      return { x, y };
    });

    const linePath = smoothPath(points);

    const areaPath = linePath.copy();
    const last = points[points.length - 1];
    const first = points[0];
    areaPath.lineTo(last.x, height - padding);
    areaPath.lineTo(first.x, height - padding);
    areaPath.close();

    return {
      strokePath: linePath,
      fillPath: areaPath,
      points,
      graphData
    };
  }, [data, height, width]);

  const [selectedIndex, setSelectedIndex] = useState(Math.max(graphData.length - 1, 0));
  useEffect(() => {
    setSelectedIndex(Math.max(graphData.length - 1, 0));
  }, [graphData.length]);
  const safeIndex = Math.min(selectedIndex, Math.max(graphData.length - 1, 0));
  const selectedPoint = points[safeIndex];
  const selectedData = graphData[safeIndex];
  const tooltipLeft = selectedPoint
    ? Math.max(
        tooltipPadding,
        Math.min(width - tooltipWidth - tooltipPadding, selectedPoint.x - tooltipWidth / 2)
      )
    : tooltipPadding;

  const updateSelection = useCallback((x: number) => {
    if (points.length === 0) return;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < points.length; i += 1) {
      const distance = Math.abs(points[i].x - x);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    setSelectedIndex(nearestIndex);
  }, [points]);

  const updateSelectionFromLocalX = useCallback(
    (localX: number) => {
      const clampedLocalX = Math.max(0, Math.min(width, localX));
      updateSelection(clampedLocalX);
    },
    [updateSelection, width]
  );

  const dateLabel =
    selectedData?.nav_date
      ? new Date(selectedData.nav_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: '2-digit'
        })
      : '--';

  return (
    <View style={styles.wrapper}>
      <Canvas style={{ width, height }}>
        <Path path={fillPath}>
          <LinearGradient start={vec(0, 0)} end={vec(0, height)} colors={[`${colors.chart}88`, `${colors.chart}10`]} />
        </Path>
        <Path path={strokePath} color={colors.chart} style="stroke" strokeWidth={2.5} />
      </Canvas>
      <View
        style={StyleSheet.absoluteFill}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onStartShouldSetResponderCapture={() => true}
        onMoveShouldSetResponderCapture={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={(event) => {
          onGestureStart?.();
          updateSelectionFromLocalX(event.nativeEvent.locationX);
        }}
        onResponderMove={(event) => {
          updateSelectionFromLocalX(event.nativeEvent.locationX);
        }}
        onResponderRelease={() => {
          onGestureEnd?.();
        }}
        onResponderTerminate={() => {
          onGestureEnd?.();
        }}
      />
      {selectedPoint ? (
        <>
          <View pointerEvents="none" style={[styles.verticalLine, { left: selectedPoint.x }]} />
          <View pointerEvents="none" style={[styles.dot, { left: selectedPoint.x - 4, top: selectedPoint.y - 4 }]} />
          <View pointerEvents="none" style={[styles.tooltip, { left: tooltipLeft, width: tooltipWidth }]}>
            <View style={styles.tooltipTop}>
              <View style={styles.legendDot} />
              <Text style={styles.tooltipValue}>{`NAV:₹${toNumber(selectedData?.nav).toFixed(2)}`}</Text>
            </View>
            <Text style={styles.tooltipDate}>{dateLabel}</Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    position: 'relative'
  },
  verticalLine: {
    position: 'absolute',
    top: 12,
    bottom: 12,
    width: 1,
    backgroundColor: `${colors.chart}aa`
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.chart
  },
  tooltip: {
    position: 'absolute',
    top: 10,
    backgroundColor: '#eceff3',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  tooltipTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: colors.primaryDark
  },
  tooltipValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700'
  },
  tooltipDate: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12
  }
});
