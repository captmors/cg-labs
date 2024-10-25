import os
import tempfile
from typing import Callable
import cv2
from fastapi import HTTPException, UploadFile


def process_image(file: UploadFile, filter_func: Callable) -> str:
    """Helper function to process images and return result path"""
    # temp files for input and output
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_in, \
         tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_out:
        
        content = file.file.read()  
        temp_in.write(content)
        temp_in.flush()
        
        image = cv2.imread(temp_in.name)
        if image is None:
            os.unlink(temp_in.name)
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        try:
            result = filter_func(image)
            cv2.imwrite(temp_out.name, result)
            
            os.unlink(temp_in.name)
            return temp_out.name
        except Exception as e:
            os.unlink(temp_in.name)
            os.unlink(temp_out.name)
            raise HTTPException(status_code=500, detail=str(e))
        
    
def cleanup_temp_file(path: str):
    """Cleanup function to remove temporary file after response is sent"""
    async def cleanup():
        try:
            os.unlink(path)
        except:
            pass
    return cleanup
