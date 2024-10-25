from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse
from utils.utils import cleanup_temp_file, process_image
from .filters.nonlinear import median_filter, min_filter, max_filter
from .filters.morph import erosion, dilation, opening, closure

nonlinear_router = APIRouter(prefix="/nonlinear", tags=["nonlinear"])
morph_router = APIRouter(prefix="/morph", tags=["morph"])


# Nonlinear 
@nonlinear_router.post("/median")
def apply_median(file: UploadFile = File(...)):
    output_path = process_image(file, median_filter)
    return FileResponse(output_path, background=cleanup_temp_file(output_path))

@nonlinear_router.post("/minimum")
def apply_minimum(file: UploadFile = File(...)):
    output_path = process_image(file, min_filter)
    return FileResponse(output_path, background=cleanup_temp_file(output_path))

@nonlinear_router.post("/maximum")
def apply_maximum(file: UploadFile = File(...)):
    output_path = process_image(file, max_filter)
    return FileResponse(output_path, background=cleanup_temp_file(output_path))


# Morphological 
@morph_router.post("/erosion")
def apply_erosion(file: UploadFile = File(...)):
    output_path = process_image(file, erosion)
    return FileResponse(output_path, background=cleanup_temp_file(output_path))

@morph_router.post("/dilation")
def apply_dilation(file: UploadFile = File(...)):
    output_path = process_image(file, dilation)
    return FileResponse(output_path, background=cleanup_temp_file(output_path))

@morph_router.post("/opening")
def apply_opening(file: UploadFile = File(...)):
    output_path = process_image(file, opening)
    return FileResponse(output_path, background=cleanup_temp_file(output_path))

@morph_router.post("/closure")
def apply_closure(file: UploadFile = File(...)):
    output_path = process_image(file, closure)
    return FileResponse(output_path, background=cleanup_temp_file(output_path))
