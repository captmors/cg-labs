from typing import List, Tuple
from pydantic import BaseModel


class LineRequest(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int

class CircleRequest(BaseModel):
    xc: int
    yc: int
    radius: int

class AlgorithmResponse(BaseModel):
    points: List[Tuple[int, int]]
    execution_time: float
    