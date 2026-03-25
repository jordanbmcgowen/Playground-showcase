"""
Find the screen area by looking at the inner boundary of the opaque bezel.
Scan from the center outward to find where opaque pixels begin.
"""
from PIL import Image
import numpy as np

def find_screen_from_center(image_path):
    img = Image.open(image_path).convert("RGBA")
    w, h = img.size
    data = np.array(img)
    alpha = data[:, :, 3]
    
    cx, cy = w // 2, h // 2
    
    # The center should be transparent (screen area)
    # Scan outward from center to find where bezel starts
    
    # Scan left from center
    left = 0
    for x in range(cx, 0, -1):
        if alpha[cy, x] > 200:  # opaque = bezel
            left = x + 1
            break
    
    # Scan right from center
    right = w
    for x in range(cx, w):
        if alpha[cy, x] > 200:
            right = x
            break
    
    # Scan up from center
    top = 0
    for y in range(cy, 0, -1):
        if alpha[y, cx] > 200:
            top = y + 1
            break
    
    # Scan down from center
    bottom = h
    for y in range(cy, h):
        if alpha[y, cx] > 200:
            bottom = y
            break
    
    print(f"  Image size: {w}x{h}")
    print(f"  Screen area: left={left}, top={top}, right={right}, bottom={bottom}")
    print(f"  Screen size: {right-left}x{bottom-top}")
    
    left_pct = left / w * 100
    top_pct = top / h * 100
    width_pct = (right - left) / w * 100
    height_pct = (bottom - top) / h * 100
    
    print(f"  CSS: left={left_pct:.2f}%, top={top_pct:.2f}%, width={width_pct:.2f}%, height={height_pct:.2f}%")
    
    return {'left': left, 'top': top, 'right': right, 'bottom': bottom,
            'left_pct': left_pct, 'top_pct': top_pct,
            'width_pct': width_pct, 'height_pct': height_pct}

ASSETS = "/home/user/workspace/jordanmcgowen/assets"

print("=== iPhone 15 Pro ===")
iphone = find_screen_from_center(f"{ASSETS}/iphone-frame.png")

print("\n=== MacBook Pro 14 ===")
macbook = find_screen_from_center(f"{ASSETS}/macbook-frame.png")

print("\n=== iPad Pro 11 ===")
ipad = find_screen_from_center(f"{ASSETS}/ipad-frame.png")
