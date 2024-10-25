import cv2
import numpy as np
from utils.kernels import DEFAULT_KERNEL

def median_filter(image: np.ndarray, kernel: np.ndarray = DEFAULT_KERNEL) -> np.ndarray:
    """
    Применение медианного фильтра для удаления шумов.
    
    :param image: Изображение в формате numpy массива.
    :param kernel: Пользовательское ядро (игнорируется, используется размер ядра).
    :return: Изображение после медианной фильтрации.
    """
    kernel_size = kernel.shape[0]
    return cv2.medianBlur(image, kernel_size)

def min_filter(image: np.ndarray, kernel: np.ndarray = DEFAULT_KERNEL) -> np.ndarray:
    """
    Применение минимального фильтра для уменьшения ярких шумов.
    
    :param image: Изображение в формате numpy массива.
    :param kernel: Пользовательское ядро.
    :return: Изображение после минимальной фильтрации.
    """
    return cv2.erode(image, kernel, iterations=1)

def max_filter(image: np.ndarray, kernel: np.ndarray = DEFAULT_KERNEL) -> np.ndarray:
    """
    Применение максимального фильтра для устранения темных шумов.
    
    :param image: Изображение в формате numpy массива.
    :param kernel: Пользовательское ядро.
    :return: Изображение после максимальной фильтрации.
    """
    return cv2.dilate(image, kernel, iterations=1)
