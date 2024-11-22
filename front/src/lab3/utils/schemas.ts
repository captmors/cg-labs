export interface LineRequest {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }
  
  export interface CircleRequest {
    xc: number;
    yc: number;
    radius: number;
  }
  
  export interface AlgorithmResponse {
    points: [number, number][];
    execution_time: number;
  }
  
  export const validateLineRequest = (data: LineRequest): boolean => {
    return !isNaN(data.x1) && !isNaN(data.y1) && !isNaN(data.x2) && !isNaN(data.y2);
  };
  
  export const validateCircleRequest = (data: CircleRequest): boolean => {
    return !isNaN(data.xc) && !isNaN(data.yc) && !isNaN(data.radius);
  };
  