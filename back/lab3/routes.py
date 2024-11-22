from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import time

lab_name = "lab3"
router = APIRouter(prefix=f"/{lab_name}", tags=["lab3"])

class LineRequest(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int

@router.post("/dda")
def dda_algorithm(data: LineRequest):
    start_time = time.time()
    
    x1, y1, x2, y2 = data.x1, data.y1, data.x2, data.y2
    points = []

    dx = x2 - x1
    dy = y2 - y1
    steps = max(abs(dx), abs(dy))
    if steps == 0:
        raise HTTPException(status_code=400, detail="Invalid line: start and end points are the same.")
    
    x_inc = dx / steps
    y_inc = dy / steps

    x, y = x1, y1
    for _ in range(steps + 1):
        points.append((round(x), round(y)))
        x += x_inc
        y += y_inc
    
    end_time = time.time()
    execution_time = end_time - start_time

    return {"algorithm": "dda", "points": points, "execution_time": execution_time}

@router.post("/bresenham")
def bresenham_algorithm(data: LineRequest):
    start_time = time.time()
    
    x1, y1, x2, y2 = data.x1, data.y1, data.x2, data.y2
    points = []

    dx = abs(x2 - x1)
    dy = abs(y2 - y1)
    sx = 1 if x1 < x2 else -1
    sy = 1 if y1 < y2 else -1
    err = dx - dy

    while True:
        points.append((x1, y1))
        if x1 == x2 and y1 == y2:
            break
        e2 = 2 * err
        if e2 > -dy:
            err -= dy
            x1 += sx
        if e2 < dx:
            err += dx
            y1 += sy

    end_time = time.time()  
    execution_time = end_time - start_time 

    return {"algorithm": "bresenham", "points": points, "execution_time": execution_time}

