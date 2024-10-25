from fastapi import FastAPI
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

# fastapi 
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# lab1
@app.post("/lab1")
async def open_lab1():
    try:
        lab1_path = os.path.join(".", "lab1", "main.py")
        subprocess.Popen([sys.executable, lab1_path])
        return {"status": "success"}
    except Exception as e:
        logging.error(f"Error occurred: {str(e)}")
        return {"status": "error", "message": str(e)}

# lab2
from lab2.routes import nonlinear_router as lab2_nonlinear_router
from lab2.routes import morph_router as lab2_morph_router

app.include_router(lab2_nonlinear_router)
app.include_router(lab2_morph_router)


## Uncomment if run not from bash 

if __name__ == "__main__":
    logging.info("Starting backend server")
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    