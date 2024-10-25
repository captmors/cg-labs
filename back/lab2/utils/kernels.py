import numpy as np
import cv2

# Пример использования:
# square_kernel = Kernels(kernel_type="square", size=5).get_kernel()
# circle_kernel = Kernels(kernel_type="circle", size=5).get_kernel()
# custom_kernel = Kernels(kernel_type="custom", custom_kernel=[[1, 1, 1], [0, 0, 0], [0, 1, 0]]).get_kernel()

class Kernels:
    def __init__(self, kernel_type: str = "square", size: int = 3, custom_kernel: list = None):
        """
        Инициализация ядра.

        :param kernel_type: Тип ядра ('square', 'circle', 'custom').
        :param size: Размер ядра (для квадратных или круглых).
        :param custom_kernel: Определение пользовательского ядра в виде списка (используется только для custom).
        """
        self.kernel_type = kernel_type
        self.size = size
        self.custom_kernel = custom_kernel

        if self.kernel_type == "square":
            self.kernel = self._square_kernel(self.size)
        elif self.kernel_type == "circle":
            self.kernel = self._circle_kernel(self.size)
        elif self.kernel_type == "custom" and self.custom_kernel is not None:
            self.kernel = self._custom_kernel(self.custom_kernel)
        else:
            raise ValueError("Некорректный тип ядра или отсутствует пользовательское ядро.")
    
    def _square_kernel(self, size: int) -> np.ndarray:
        """Создает квадратное ядро."""
        return np.ones((size, size), np.uint8)

    def _circle_kernel(self, size: int) -> np.ndarray:
        """Создает круглое ядро с диаметром size."""
        radius = size // 2
        kernel = np.zeros((size, size), np.uint8)
        cv2.circle(kernel, (radius, radius), radius, 1, -1)
        return kernel

    def _custom_kernel(self, custom_kernel: list) -> np.ndarray:
        """Создает ядро на основе пользовательского списка."""
        return np.array(custom_kernel, dtype=np.uint8)
    
    def get_kernel(self) -> np.ndarray:
        """Возвращает сгенерированное ядро."""
        return self.kernel


DEFAULT_KERNEL = Kernels(kernel_type="square", size=3).get_kernel()
