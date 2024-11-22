import logging
from time import time

def log_execution_time(func):
    def wrapper(*args, **kwargs):
        
        start_time = time()
        result = func(*args, **kwargs)
        elapsed_time = time() - start_time
        
        logging.info(f"\nВыполнен {func.__name__}\nВремя: {elapsed_time:.4f} секунд")
        
        return result, elapsed_time
    return wrapper
