import React, { useMemo } from 'react';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

type DonutSegment = {
  value: number;
  color: string;
};

type AllocationDonutProps = {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  gapDegrees?: number;
  startAngle?: number;
};

export function AllocationDonut({
  segments,
  size = 170,
  strokeWidth = 20,
  gapDegrees = 0,
  startAngle = -20
}: AllocationDonutProps) {
  const { paths } = useMemo(() => {
    const cleanSegments = segments.filter((segment) => Number.isFinite(segment.value) && segment.value > 0);
    const total = cleanSegments.reduce((sum, segment) => sum + segment.value, 0);
    const radius = (size - strokeWidth) / 2;
    const oval = Skia.XYWHRect(strokeWidth / 2, strokeWidth / 2, radius * 2, radius * 2);

    let cursor = startAngle;
    const paths = cleanSegments.map((segment) => {
      const sweep = total > 0 ? (segment.value / total) * 360 : 0;
      const trimmedSweep = Math.max(sweep - gapDegrees, 0.1);
      const start = cursor + gapDegrees / 2;
      const path = Skia.Path.Make();
      path.addArc(oval, start, trimmedSweep);
      cursor += sweep;
      return { path, color: segment.color };
    });

    return { paths };
  }, [gapDegrees, segments, size, startAngle, strokeWidth]);

  return (
    <Canvas style={{ width: size, height: size }}>
      {paths.map((item, index) => (
        <Path
          key={`${item.color}-${index}`}
          path={item.path}
          color={item.color}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="butt"
        />
      ))}
    </Canvas>
  );
}
