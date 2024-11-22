from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.defines import root_dir
import subprocess
import sys
import os
import logging

# logs
log_dir = os.path.join(root_dir, 'logs', 'back')
os.makedirs(log_dir, exist_ok=True)
log_file_path = os.path.join(log_dir, 'log.log')  
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file_path, mode='w'),  
        # logging.StreamHandler()
    ]
)

logging.info("Logging configured")

# fastapi 
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# lab1
lab_name = "lab1"
lab1_router = APIRouter(prefix=f"/{lab_name}", tags=["lab1"])

@lab1_router.post("/")
async def open_lab1():
    try:
        lab1_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "lab1", "main.py"))
        subprocess.Popen([sys.executable, lab1_path])
        return {"status": "success"}
    except Exception as e:
        logging.error(f"Error occurred: {str(e)}")
        return {"status": "error", "message": str(e)}

app.include_router(lab1_router)

# lab2
from lab2.utils.minio import minio_routine
from lab2.routes import lab2_router
from lab2.routes import etc_router as lab2_etc_router

minio_routine()

app.include_router(lab2_router)
app.include_router(lab2_etc_router)

# lab3 
from lab3.routes import router as lab3_router

app.include_router(lab3_router)
