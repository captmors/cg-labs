import numpy as np
import cv2

# Example of usage:
# square_kernel = Kernels(kernel_type="square", size=5).get_kernel()
# circle_kernel = Kernels(kernel_type="circle", size=5).get_kernel()
# custom_kernel = Kernels(kernel_type="custom", custom_kernel=[[1, 1, 1], [0, 0, 0], [0, 1, 0]]).get_kernel()

class Kernels:
    def __init__(self, kernel_type: str = "square", size: int = 3, custom_kernel: list = None):
        """
        Initializes the kernel.

        :param kernel_type: Type of the kernel ('square', 'circle', 'custom').
        :param size: Size of the kernel (for square or circle).
        :param custom_kernel: Definition of the custom kernel as a list (used only for custom).
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
            raise ValueError("Invalid kernel type or missing custom kernel.")
    
    def _square_kernel(self, size: int) -> np.ndarray:
        """Creates a square kernel."""
        return np.ones((size, size), np.uint8)

    def _circle_kernel(self, size: int) -> np.ndarray:
        """Creates a circular kernel with diameter size."""
        radius = size // 2
        kernel = np.zeros((size, size), np.uint8)
        cv2.circle(kernel, (radius, radius), radius, 1, -1)
        return kernel

    def _custom_kernel(self, custom_kernel: list) -> np.ndarray:
        """Creates a kernel based on the custom list."""
        return np.array(custom_kernel, dtype=np.uint8)
    
    def get_kernel(self) -> np.ndarray:
        """Returns the generated kernel."""
        return self.kernel


DEFAULT_KERNEL = Kernels(kernel_type="square", size=3).get_kernel()

