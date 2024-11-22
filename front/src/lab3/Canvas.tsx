import React, { useState, useEffect, useRef } from "react";

interface CanvasProps {
  points: { x: number; y: number }[];
  scale: number;
  origin: { x: number; y: number };
  drawGrid?: boolean;
  resetCanvas?: boolean;
  onReset?: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ points, scale, origin, drawGrid, resetCanvas, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Очистка канваса
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Установим цвет фона
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисование осей
    drawAxes(ctx);

    // Рисование точек
    drawPoints(ctx, points);

    // Рисование линий между точками
    drawLines(ctx, points);

    // Рисование сетки
    if (drawGrid) {
      drawGridLines(ctx);
    }

    // Если сброс
    if (resetCanvas && onReset) {
      onReset();
    }
  }, [points, resetCanvas, origin, scale, drawGrid]);

  const drawLines = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
    if (points.length < 2) return;

    ctx.strokeStyle = "black"; 
    ctx.lineWidth = 1;

    // Проверка каждой точки
    const isOutOfCanvas = (point: { x: number; y: number }) => {
      const canvasX = point.x * scale + canvasRef.current!.width / 2;
      const canvasY = -point.y * scale + canvasRef.current!.height / 2;
      return canvasX < 0 || canvasX > ctx.canvas.width || canvasY < 0 || canvasY > ctx.canvas.height;
    };

    // Проверка всех точек
    points.forEach((point, index) => {
      if (isOutOfCanvas(point)) {
        console.log(`Point out of canvas bounds: (${point.x}, ${point.y})`);
      }
    });

    ctx.beginPath();
    ctx.moveTo(points[0].x * scale + canvasRef.current!.width / 2, points[0].y * scale + canvasRef.current!.height / 2);
    points.slice(1).forEach((point) => {
      ctx.lineTo(point.x * scale + canvasRef.current!.width / 2, point.y * scale + canvasRef.current!.height / 2);
    });
    ctx.stroke();
  };

  const drawAxes = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    // Горизонтальная ось (ось X)
    ctx.beginPath();
    ctx.moveTo(0, canvasRef.current!.height / 2);
    ctx.lineTo(ctx.canvas.width, canvasRef.current!.height / 2);
    ctx.stroke();

    // Вертикальная ось (ось Y)
    ctx.beginPath();
    ctx.moveTo(canvasRef.current!.width / 2, 0);
    ctx.lineTo(canvasRef.current!.width / 2, ctx.canvas.height);
    ctx.stroke();
  };

  const drawPoints = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
    points.forEach((point) => {
      const canvasX = point.x * scale + canvasRef.current!.width / 2;
      const canvasY = point.y * scale + canvasRef.current!.height / 2;
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 0.8, 0, 2 * Math.PI);
      ctx.fill();
    });
  };
  
  const drawGridLines = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 0.5;
    const gridStep = scale * 20;
  
    // Линии по оси X (горизонтальные)
    for (let x = 0; x <= ctx.canvas.width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
  
    // Линии по оси Y (вертикальные)
    for (let y = 0; y <= ctx.canvas.height; y += gridStep) {
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
      />
    </div>
  );
};

export default Canvas;
