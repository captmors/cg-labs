import cv2
import numpy as np
from ..utils.kernels import DEFAULT_KERNEL

def median_filter(image, kernel=DEFAULT_KERNEL):
    kernel_size = kernel.shape[0]
    return cv2.medianBlur(image, kernel_size)

def min_filter(image, kernel=DEFAULT_KERNEL):
    return cv2.erode(image, kernel, iterations=1)

def max_filter(image, kernel=DEFAULT_KERNEL):
    return cv2.dilate(image, kernel, iterations=1)

