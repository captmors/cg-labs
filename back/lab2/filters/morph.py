import cv2
import numpy as np
from ..utils.kernels import DEFAULT_KERNEL

# Blackens whites
def erosion(image: np.ndarray, kernel: np.ndarray = DEFAULT_KERNEL) -> np.ndarray:
    """Applies erosion with a custom kernel."""
    return cv2.erode(image, kernel, iterations=1)

# Whitens blacks
def dilation(image: np.ndarray, kernel: np.ndarray = DEFAULT_KERNEL) -> np.ndarray:
    """Applies dilation with a custom kernel."""
    return cv2.dilate(image, kernel, iterations=1)

def opening(image: np.ndarray, kernel: np.ndarray = DEFAULT_KERNEL) -> np.ndarray:
    """Opening: first erosion, then dilation."""
    return cv2.morphologyEx(image, cv2.MORPH_OPEN, kernel)

def closure(image: np.ndarray, kernel: np.ndarray = DEFAULT_KERNEL) -> np.ndarray:
    """Closure: first dilation, then erosion."""
    return cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)

