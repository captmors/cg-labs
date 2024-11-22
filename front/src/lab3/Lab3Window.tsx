import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, Button, Text, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/defines';

const Lab3Window: React.FC = () => {
  const [algorithm, setAlgorithm] = useState('dda');
  const [points, setPoints] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, step: number) => {
    ctx.strokeStyle = '#ccc';
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const fetchLineData = async (x1: number, y1: number, x2: number, y2: number) => {
    setLoading(true);
    setExecutionTime(null);
    try {
      const response = await axios.post<{ points: [number, number][]; execution_time: number }>(
        `${API_BASE_URL}/lab3/${algorithm}`,
        { x1, y1, x2, y2 }
      );
      setPoints(response.data.points);
      setExecutionTime(response.data.execution_time);
    } catch (error) {
      console.error('Error fetching line data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRender = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    // Draw grid
    drawGrid(ctx, width, height, 20);
    // Draw lines based on fetched points
    points.forEach(([x, y], index) => {
      if (index > 0) {
        const [prevX, prevY] = points[index - 1];
        drawLine(ctx, prevX, prevY, x, y);
      }
    });
  };

  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(e.target.value);
  };

  const handleGenerateLine = () => {
    // Hardcoded example points (can be adjusted as needed)
    fetchLineData(50, 50, 350, 350);  // Example coordinates for line
  };

  useEffect(() => {
    handleRender();
  }, [points]);

  return (
    <Flex direction="column" align="center" p={4}>
      <select value={algorithm} onChange={handleAlgorithmChange} style={{ marginBottom: '1rem', width: '200px' }}>
        <option value="dda">DDA Algorithm</option>
        <option value="bresenham">Bresenham's Algorithm</option>
        <option value="bresenhamCircle">Bresenham's Circle</option>
      </select>
      <Button onClick={handleGenerateLine} mb={4} colorScheme="teal">
        Generate Line
      </Button>
      {loading && <Spinner size="lg" mb={4} />}
      {executionTime !== null && !loading && (
        <Text mt={2}>Execution Time: {executionTime.toFixed(4)} seconds</Text>
      )}
      <Box mt={4}>
        <canvas ref={canvasRef} width={400} height={400} style={{ border: '1px solid black' }} />
      </Box>
    </Flex>
  );
};

export default Lab3Window;
