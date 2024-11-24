import React, { useState, useEffect, useRef } from "react";

interface CanvasProps {
  points: { x: number; y: number }[];
  scale: number;
  origin: { x: number; y: number };
  drawGrid?: boolean;
  resetCanvas?: boolean;
  onReset?: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  points,
  scale,
  origin,
  drawGrid,
  resetCanvas,
  onReset,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentScale, setCurrentScale] = useState(scale);
  const [currentOrigin, setCurrentOrigin] = useState(origin);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawAxes(ctx);

    if (drawGrid) drawGridLines(ctx);
    drawPoints(ctx, points);
    drawLines(ctx, points);

    if (resetCanvas && onReset) onReset();
  }, [points, resetCanvas, currentOrigin, currentScale, drawGrid]);

  const handleKeyDown = (event: KeyboardEvent) => {
    const step = 20; // шаг перемещения
    switch (event.key) {
      case "ArrowUp":
        setCurrentOrigin((prev) => ({ ...prev, y: prev.y + step }));
        break;
      case "ArrowDown":
        setCurrentOrigin((prev) => ({ ...prev, y: prev.y - step }));
        break;
      case "ArrowLeft":
        setCurrentOrigin((prev) => ({ ...prev, x: prev.x + step }));
        break;
      case "ArrowRight":
        setCurrentOrigin((prev) => ({ ...prev, x: prev.x - step }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const zoomFactor = 1.1;
  
    // Определяем направление прокрутки
    const delta = event.deltaY;
    const newScale = delta < 0 ? currentScale * zoomFactor : currentScale / zoomFactor;
  
    // Центрирование для плавного зума
    const mouseX = event.clientX - canvasRef.current!.offsetLeft;
    const mouseY = event.clientY - canvasRef.current!.offsetTop;
  
    setCurrentOrigin((prev) => ({
      x: (prev.x - mouseX) * (newScale / currentScale) + mouseX,
      y: (prev.y - mouseY) * (newScale / currentScale) + mouseY,
    }));
    setCurrentScale(newScale);
  };

  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    const centerX = currentOrigin.x + canvasRef.current!.width / 2;
    const centerY = currentOrigin.y + canvasRef.current!.height / 2;

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(ctx.canvas.width, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, ctx.canvas.height);
    ctx.stroke();
  };

  const drawPoints = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
    points.forEach((point) => {
      const canvasX =
        point.x * currentScale + currentOrigin.x + canvasRef.current!.width / 2;
      const canvasY =
        -point.y * currentScale + currentOrigin.y + canvasRef.current!.height / 2;
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 2, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawLines = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
    if (points.length < 2) return;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(
      points[0].x * currentScale + currentOrigin.x + canvasRef.current!.width / 2,
      -points[0].y * currentScale + currentOrigin.y + canvasRef.current!.height / 2
    );
    points.slice(1).forEach((point) => {
      ctx.lineTo(
        point.x * currentScale + currentOrigin.x + canvasRef.current!.width / 2,
        -point.y * currentScale + currentOrigin.y + canvasRef.current!.height / 2
      );
    });
    ctx.stroke();
  };

  const drawGridLines = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 0.5;
    const gridStep = currentScale * 20;

    for (let x = currentOrigin.x % gridStep; x <= ctx.canvas.width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }

    for (let y = currentOrigin.y % gridStep; y <= ctx.canvas.height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        style={{ border: "1px solid black", marginBottom: "20px" }}
        onWheel={handleWheel}
      />
    </div>
  );
};

export default Canvas;
