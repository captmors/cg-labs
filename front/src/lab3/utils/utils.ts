export const mapPointsToCanvas = (points: [number, number][], scale: number, originX: number, originY: number) => {
    return points.map(([x, y]) => ({
      x: originX + x * scale,
      y: originY - y * scale,
    }));
  };
  