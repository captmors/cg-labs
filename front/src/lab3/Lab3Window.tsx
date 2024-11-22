import React, { useEffect, useState } from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import Canvas from "./Canvas";
import { postBresenhamLine, postDDA, postBresenhamCircle, postStep } from "./utils/api";
import { mapPointsToCanvas } from "./utils/utils";
import CustomSelect from "./CustomSelect";
import { LineRequest, CircleRequest, validateLineRequest, validateCircleRequest, AlgorithmResponse } from "./utils/schemas";

const Lab3Window: React.FC = () => {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [algorithm, setAlgorithm] = useState("bresenham_line");
  const [inputs, setInputs] = useState({ x1: 0, y1: 0, x2: 0, y2: 0, radius: 0 });
  const [resetCanvas, setResetCanvas] = useState(false);

  const scale = 1;
  const origin = { x: 0, y: 0 };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  useEffect(() => {
    const updatePreviewPoints = async () => {
      try {
        if (algorithm === "bresenham_line" && validateLineRequest(inputs)) {
          const data = await postBresenhamLine({ x1: inputs.x1, y1: inputs.y1, x2: inputs.x2, y2: inputs.y2 });
          if (data) {
            const mappedPoints = mapPointsToCanvas(data.points, scale, origin.x, origin.y);
            setPoints(mappedPoints);
          }
        } else if (algorithm === "dda" && validateLineRequest(inputs)) {
          const data = await postDDA({ x1: inputs.x1, y1: inputs.y1, x2: inputs.x2, y2: inputs.y2 });
          if (data) {
            const mappedPoints = mapPointsToCanvas(data.points, scale, origin.x, origin.y);
            setPoints(mappedPoints);
          }
        } else if (algorithm === "bresenham_circle" && validateCircleRequest({xc: inputs.x1, yc: inputs.y1, radius: inputs.radius})) {
          const data = await postBresenhamCircle({ xc: inputs.x1, yc: inputs.y1, radius: inputs.radius });
          if (data) {
            const mappedPoints = mapPointsToCanvas(data.points, scale, origin.x, origin.y);
            setPoints(mappedPoints);
          }
        }
      } catch (error) {
        console.error("Error updating preview:", error);
      }
    };
  
    updatePreviewPoints();
  }, [inputs, algorithm]);
  

  const handleRun = async () => {
    let data: AlgorithmResponse | undefined;
    try {
      if (algorithm === "bresenham_line") {
        const request: LineRequest = { x1: inputs.x1, y1: inputs.y1, x2: inputs.x2, y2: inputs.y2 };
        data = await postBresenhamLine(request);
      } else if (algorithm === "dda") {
        const request: LineRequest = { x1: inputs.x1, y1: inputs.y1, x2: inputs.x2, y2: inputs.y2 };
        data = await postDDA(request);
      } else if (algorithm === "bresenham_circle") {
        const request: CircleRequest = { xc: inputs.x1, yc: inputs.y1, radius: inputs.radius };
        data = await postBresenhamCircle(request);
      } else if (algorithm === "step") {
        const request: LineRequest = { x1: inputs.x1, y1: inputs.y1, x2: inputs.x2, y2: inputs.y2 };
        data = await postStep(request);
      }
  
      if (data) {
        const mappedPoints = mapPointsToCanvas(data.points, scale, origin.x, origin.y);
        setPoints(mappedPoints);
        setExecutionTime(data.execution_time);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReset = () => {
    setResetCanvas(true);
    setPoints([]);
    setExecutionTime(null);
    setResetCanvas(false);
  };

  return (
    <Box>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Выбор алгоритма */}
        <CustomSelect
          options={[
            { value: "bresenham_line", label: "Bresenham Line" },
            { value: "dda", label: "DDA" },
            { value: "bresenham_circle", label: "Bresenham Circle" },
            { value: "step", label: "Step Algorithm" },
          ]}
          value={algorithm}
          onChange={(value) => setAlgorithm(value)}
        />
        {/* Ввод координат */}
        <Input placeholder="x1" name="x1" onChange={handleInputChange} />
        <Input placeholder="y1" name="y1" onChange={handleInputChange} />
        {algorithm !== "bresenham_circle" && (
          <>
            <Input placeholder="x2" name="x2" onChange={handleInputChange} />
            <Input placeholder="y2" name="y2" onChange={handleInputChange} />
          </>
        )}
        {algorithm === "bresenham_circle" && <Input placeholder="Radius" name="radius" onChange={handleInputChange} />}
        {/* Кнопки */}
        <Button onClick={handleRun}>Run Algorithm</Button>
        <Button onClick={handleReset} colorScheme="red">
          Clear Canvas
        </Button>
      </div>
      {/* Отображение времени выполнения */}
      {executionTime !== null && <Text>Execution Time: {executionTime.toFixed(2)} ms</Text>}
      {/* Канвас */}
      <Canvas points={points} drawGrid={true} scale={scale} origin={origin} resetCanvas={resetCanvas} />
    </Box>
  );
};

export default Lab3Window;
