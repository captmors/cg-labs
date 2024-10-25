import cv2
import numpy as np
from ..utils.kernels import DEFAULT_KERNEL

# Чернит белые 
def erosion(image: np.ndarray, kernel: np.ndarray = DEFAULT_KERNEL) -> np.ndarray:
    """Применение эрозии с произвольным ядром."""
    return cv2.erode(image, kernel, iterations=1)

# Белит черные
def dilation(image: np.ndarray, kernel: np.ndarray = DEFAULT_KERNEL) -> np.ndarray:
    """Применение дилатации с произвольным ядром."""
    return cv2.dilate(image, kernel, iterations=1)

def opening(image: np.ndarray, kernel: np.ndarray = DEFAULT_KERNEL) -> np.ndarray:
    """Размыкание: сначала эрозия, затем дилатация."""
    return cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)

def closure(image: np.ndarray, kernel: np.ndarray = DEFAULT_KERNEL) -> np.ndarray:
    """Замыкание: сначала дилатация, затем эрозия."""
    return cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)
