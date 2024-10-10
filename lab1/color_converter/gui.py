import tkinter as tk
from color_converter.cmyk_rgb_hsl import cmyk_to_hsl, hsl_to_cmyk, rgb_to_cmyk, cmyk_to_rgb, rgb_to_hsl, hsl_to_rgb

class ColorConverterApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Color Converter")

        # RGB Section
        self.create_rgb_section()

        # CMYK Section
        self.create_cmyk_section()

        # HSL Section
        self.create_hsl_section()

        # Color Picker (Canvas)
        self.create_color_picker()

    def create_rgb_section(self):
        self.rgb_label = tk.Label(self.root, text="RGB")
        self.rgb_label.grid(row=0, column=0, padx=10, pady=10, columnspan=2)

        self.r_slider = self.create_slider(1, 0, "R", 255, self.update_from_rgb, step=1)
        self.g_slider = self.create_slider(2, 0, "G", 255, self.update_from_rgb, step=1)
        self.b_slider = self.create_slider(3, 0, "B", 255, self.update_from_rgb, step=1)

    def create_cmyk_section(self):
        self.cmyk_label = tk.Label(self.root, text="CMYK")
        self.cmyk_label.grid(row=0, column=3, padx=10, pady=10, columnspan=2)

        self.c_slider = self.create_slider(1, 3, "C", 100, self.update_from_cmyk, step=0.01)
        self.m_slider = self.create_slider(2, 3, "M", 100, self.update_from_cmyk, step=0.01)
        self.y_slider = self.create_slider(3, 3, "Y", 100, self.update_from_cmyk, step=0.01)
        self.k_slider = self.create_slider(4, 3, "K", 100, self.update_from_cmyk, step=0.01)

    def create_hsl_section(self):
        self.hsl_label = tk.Label(self.root, text="HSL")
        self.hsl_label.grid(row=0, column=6, padx=10, pady=10, columnspan=2)

        self.h_slider = self.create_slider(1, 6, "H", 360, self.update_from_hsl, step=1)
        self.s_slider = self.create_slider(2, 6, "S", 100, self.update_from_hsl, step=0.01)
        self.l_slider = self.create_slider(3, 6, "L", 100, self.update_from_hsl, step=0.01)

    def create_slider(self, row, column, label_text, max_value, command, step):
        label = tk.Label(self.root, text=label_text)
        label.grid(row=row, column=column)
        slider = tk.Scale(self.root, from_=0, to=max_value, orient="horizontal", resolution=step, command=command)
        slider.grid(row=row, column=column + 1, padx=10, pady=5)
        return slider

    def create_color_picker(self):
        self.canvas = tk.Canvas(self.root, width=200, height=200, bg="white")
        self.canvas.grid(row=6, column=0, columnspan=3, pady=20)
        self.canvas.bind("<B1-Motion>", self.on_color_pick)
        self.canvas.bind("<Button-1>", self.on_color_pick)

    def update_all_except(self, r, g, b, except_):
        if except_ != "rgb":
            self.update_rgb(r, g, b)

        if except_ != "hsl":
            h, s, l = rgb_to_hsl(r, g, b)
            self.update_hsl(h, s, l)

        if except_ != "cmyk":
            c, m, y, k = rgb_to_cmyk(r, g, b)
            self.update_cmyk(c, m, y, k)

        self.update_canvas(r, g, b)

    def on_color_pick(self, event):
        x, y = event.x, event.y
        r = int(x / 200 * 255)
        g = int(y / 200 * 255)
        b = 255 - r
        self.update_all_except(r, g, b, "none")

    def update_canvas(self, r, g, b):
        self.canvas.configure(bg=f'#{r:02x}{g:02x}{b:02x}')

    def update_rgb(self, r, g, b):
        self.r_slider.set(r)
        self.g_slider.set(g)
        self.b_slider.set(b)

    def update_hsl(self, h, s, l):
        self.h_slider.set(h)
        self.s_slider.set(s * 100)
        self.l_slider.set(l * 100)

    def update_cmyk(self, c, m, y, k):
        self.c_slider.set(c * 100)
        self.m_slider.set(m * 100)
        self.y_slider.set(y * 100)
        self.k_slider.set(k * 100)

    def update_from_rgb(self, *args):
        r, g, b = int(self.r_slider.get()), int(self.g_slider.get()), int(self.b_slider.get())
        self.update_all_except(r, g, b, "rgb")

    def update_from_cmyk(self, *args):
        c = self.c_slider.get() / 100
        m = self.m_slider.get() / 100
        y = self.y_slider.get() / 100
        k = self.k_slider.get() / 100
        r, g, b = cmyk_to_rgb(c, m, y, k)
        self.update_all_except(r, g, b, "cmyk")

    def update_from_hsl(self, *args):
        h = self.h_slider.get()
        s = self.s_slider.get() / 100
        l = self.l_slider.get() / 100
        r, g, b = hsl_to_rgb(h, s, l)
        self.update_all_except(r, g, b, "hsl")
