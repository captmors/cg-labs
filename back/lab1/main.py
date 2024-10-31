import tkinter as tk
from color_converter.gui import ColorConverterApp
import logging

logging.basicConfig(level=logging.ERROR)

if __name__ == "__main__":
    try:
        root = tk.Tk()
        app = ColorConverterApp(root)
        root.mainloop()
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
