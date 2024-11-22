import base64
from io import BytesIO
from typing import List
import cv2
from fastapi import APIRouter, File, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse, JSONResponse
import numpy as np

from .schemas import FilterName, ImageData, RawImageData
from .utils.minio import get_minio_client, minio_routine
from .filters.nonlinear import median_filter, min_filter, max_filter
from .filters.morph import erosion, dilation, opening, closure

lab_name = "lab2"

lab2_router = APIRouter(prefix=f"/{lab_name}", tags=["lab2"])
etc_router = APIRouter(prefix=f"/{lab_name}", tags=["lab2, etc"])

MORPH_FILTERS = {
    FilterName.EROSION.value: erosion,
    FilterName.DILATION.value: dilation,
    FilterName.OPENING.value: opening,
    FilterName.CLOSURE.value: closure,
}

NONLINEAR_FILTERS = {
    FilterName.MEDIAN.value: median_filter,
    FilterName.MINIMUM.value: min_filter,
    FilterName.MAXIMUM.value: max_filter,
}

def create_filter_endpoints(router: APIRouter):
    for filter_name, filter_function in MORPH_FILTERS.items():
        @router.post(f"/morph/{filter_name}")
        async def apply_morph_filter(file: UploadFile = File(...), filter_function=filter_function):
            return await apply_filter(file, filter_function)

    for filter_name, filter_function in NONLINEAR_FILTERS.items():
        @router.post(f"/nonlinear/{filter_name}")
        async def apply_nonlinear_filter(file: UploadFile = File(...), filter_function=filter_function):
            return await apply_filter(file, filter_function)

create_filter_endpoints(lab2_router)

async def apply_filter(file: UploadFile, filter_function):
    try:
        contents = await file.read()
        np_image = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_UNCHANGED)

        if np_image is None:
            raise HTTPException(status_code=400, detail="Failed to decode the image.")

        processed_image = filter_function(np_image)

        _, encoded_image = cv2.imencode('.png', processed_image)
        base64_image = base64.b64encode(encoded_image).decode('utf-8')

        return {"image": base64_image}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")
    
# Etc 
@etc_router.get("/images", response_model=List[ImageData])
async def get_images(
    page: int = Query(1, ge=1), 
    limit: int = Query(10, ge=1)
):
    """
    Возвращает список изображений с minio url
    """
    client = get_minio_client()
    bucket_name = "images"

    objects = client.list_objects(bucket_name, recursive=True)
    all_images = list(objects)
    
    start = (page - 1) * limit
    end = start + limit
    paginated_images = all_images[start:end]
    
    image_data = []
    for idx, obj in enumerate(paginated_images, 1):
        url = client.presigned_get_object(bucket_name, obj.object_name)

        image_data.append({
            "id": start + idx,
            "url": url,
            "name": obj.object_name
        })
    
    return image_data

@etc_router.get("/images/raw", response_model=List[RawImageData])
async def get_raw_images(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1)
):
    """
    Возвращает список изображений в base64 
    """
    client = get_minio_client()
    bucket_name = "images"

    objects = client.list_objects(bucket_name, recursive=True)
    all_images = list(objects)

    start = (page - 1) * limit
    end = start + limit
    paginated_images = all_images[start:end]

    image_data = []
    for idx, obj in enumerate(paginated_images, 1):
        try:
            image = client.get_object(bucket_name, obj.object_name)
            image_bytes = image.read()

            encoded_image = base64.b64encode(image_bytes).decode('utf-8')

            image_data.append({
                "id": start + idx,
                "name": obj.object_name,
                "image": encoded_image 
            })
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching image: {e}")

    return image_data

@etc_router.post("/upload_image/")
async def upload_image(file: UploadFile = File(...)):
    bucket_name = "images"
    client = get_minio_client()
    
    if not client.bucket_exists(bucket_name):
        client.make_bucket(bucket_name)
    
    filename = file.filename
    
    try:
        client.stat_object(bucket_name, filename)
        return {"message": f"File '{filename}' already exists in bucket. Skipping upload."}
    except Exception:
        contents = await file.read() 
        client.put_object(
            bucket_name, 
            filename, 
            BytesIO(contents), 
            len(contents)
        )
        return {"message": f"File '{filename}' uploaded successfully."}
    
@etc_router.post("/run_upload_routine/")
async def run_upload_routine():
    img_dir = "./data/images"
    bucket_name = "images"
    try:
        minio_routine(img_dir, bucket_name)
        return {"message": f"Images from {img_dir} uploaded to bucket {bucket_name} successfully."}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}
    