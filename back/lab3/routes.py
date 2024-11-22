from fastapi import APIRouter
from .schemas import AlgorithmResponse, CircleRequest, LineRequest
from .utils.algorithms import bresenham_circle, bresenham_line, dda_algorithm, step_algorithm

lab_name = "lab3"
router = APIRouter(prefix=f"/{lab_name}", tags=["lab3"])

@router.post("/bresenham_line", response_model=AlgorithmResponse)
def api_bresenham_line(data: LineRequest):
    points, execution_time = bresenham_line(data.x1, data.y1, data.x2, data.y2)
    return {"points": points, "execution_time": execution_time}

@router.post("/dda", response_model=AlgorithmResponse)
def api_dda(data: LineRequest):
    points, execution_time = dda_algorithm(data.x1, data.y1, data.x2, data.y2)
    return {"points": points, "execution_time": execution_time}

@router.post("/bresenham_circle", response_model=AlgorithmResponse)
def api_bresenham_circle(data: CircleRequest):
    points, execution_time = bresenham_circle(data.xc, data.yc, data.radius)
    return {"points": points, "execution_time": execution_time}


@router.post("/step", response_model=AlgorithmResponse)
def api_step(data: LineRequest):
    points, execution_time = step_algorithm(data.x1, data.y1, data.x2, data.y2)
    return {"points": points, "execution_time": execution_time}
