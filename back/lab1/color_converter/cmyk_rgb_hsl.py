# cmyk_rgb_hsl.py
def rgb_to_cmyk(r, g, b):
    if (r, g, b) == (0, 0, 0):
        return 0, 0, 0, 1
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    k = 1 - max(r, g, b)
    c = (1 - r - k) / (1 - k)
    m = (1 - g - k) / (1 - k)
    y = (1 - b - k) / (1 - k)
    return round(c, 4), round(m, 4), round(y, 4), round(k, 4)

def cmyk_to_rgb(c, m, y, k):
    r = 255 * (1 - c) * (1 - k)
    g = 255 * (1 - m) * (1 - k)
    b = 255 * (1 - y) * (1 - k)
    return int(r), int(g), int(b)

def rgb_to_hsl(r, g, b):
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    max_color = max(r, g, b)
    min_color = min(r, g, b)
    l = (max_color + min_color) / 2

    if max_color == min_color:
        h = s = 0
    else:
        d = max_color - min_color
        s = d / (2 - max_color - min_color) if l > 0.5 else d / (max_color + min_color)
        if max_color == r:
            h = (g - b) / d + (6 if g < b else 0)
        elif max_color == g:
            h = (b - r) / d + 2
        else:
            h = (r - g) / d + 4
        h /= 6
    return int(h * 360), round(s, 4), round(l, 4)

def hsl_to_rgb(h, s, l):
    h = h / 360
    def hue_to_rgb(p, q, t):
        if t < 0: t += 1
        if t > 1: t -= 1
        if t < 1 / 6: return p + (q - p) * 6 * t
        if t < 1 / 2: return q
        if t < 2 / 3: return p + (q - p) * (2 / 3 - t) * 6
        return p

    if s == 0:
        r = g = b = l * 255
    else:
        q = l * (1 + s) if l < 0.5 else l + s - l * s
        p = 2 * l - q
        r = 255 * hue_to_rgb(p, q, h + 1 / 3)
        g = 255 * hue_to_rgb(p, q, h)
        b = 255 * hue_to_rgb(p, q, h - 1 / 3)
    return int(r), int(g), int(b)

def cmyk_to_hsl(c, m, y, k):
    r, g, b = cmyk_to_rgb(c, m, y, k)
    return rgb_to_hsl(r, g, b)

def hsl_to_cmyk(h, s, l):
    r, g, b = hsl_to_rgb(h, s, l)
    return rgb_to_cmyk(r, g, b)