"""
Analyze device frame PNGs to find the exact screen area (the transparent/white region).
We'll scan for the bounding box of the non-bezel area.
"""
from PIL import Image
import numpy as np

def find_screen_rect(image_path):
    """Find the screen region by looking for the large white/transparent rectangular area."""
    img = Image.open(image_path).convert("RGBA")
    w, h = img.size
    data = np.array(img)
    
    # The screen area is where alpha is 0 (transparent) or pixels are white
    # In these mockup frames, the screen area is fully transparent (alpha=0)
    alpha = data[:, :, 3]
    
    # Find rows and cols where alpha is 0 (transparent = screen area)
    transparent_mask = alpha == 0
    
    # Find the bounding box of the transparent region
    rows = np.any(transparent_mask, axis=1)
    cols = np.any(transparent_mask, axis=0)
    
    if not rows.any() or not cols.any():
        print(f"  No transparent region found in {image_path}")
        # Try white pixels instead
        r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
        white_mask = (r > 240) & (g > 240) & (b > 240)
        rows = np.any(white_mask, axis=1)
        cols = np.any(white_mask, axis=0)
    
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    
    print(f"  Image size: {w}x{h}")
    print(f"  Screen area: left={cmin}, top={rmin}, right={cmax+1}, bottom={rmax+1}")
    print(f"  Screen size: {cmax+1-cmin}x{rmax+1-rmin}")
    
    # Express as percentages for CSS positioning
    left_pct = cmin / w * 100
    top_pct = rmin / h * 100
    right_pct = (w - cmax - 1) / w * 100
    bottom_pct = (h - rmax - 1) / h * 100
    width_pct = (cmax + 1 - cmin) / w * 100
    height_pct = (rmax + 1 - rmin) / h * 100
    
    print(f"  CSS inset: left={left_pct:.2f}% top={top_pct:.2f}% right={right_pct:.2f}% bottom={bottom_pct:.2f}%")
    print(f"  Screen as % of frame: width={width_pct:.2f}% height={height_pct:.2f}%")
    
    return {
        'left': cmin, 'top': rmin, 'right': cmax+1, 'bottom': rmax+1,
        'left_pct': left_pct, 'top_pct': top_pct,
        'right_pct': right_pct, 'bottom_pct': bottom_pct,
        'width_pct': width_pct, 'height_pct': height_pct
    }

ASSETS = "/home/user/workspace/jordanmcgowen/assets"

# We need to re-download the frames for analysis
import subprocess
subprocess.run(["curl", "-sL", "-o", f"{ASSETS}/iphone-frame.png", 
    "https://mockuphone.com/images/mockup_templates/apple-iphone-15-pro-black-titanium-portrait.png"], check=True)
subprocess.run(["curl", "-sL", "-o", f"{ASSETS}/macbook-frame.png",
    "https://mockuphone.com/images/devices_picture/apple-macbookpro14-front.png"], check=True)
subprocess.run(["curl", "-sL", "-o", f"{ASSETS}/ipad-frame.png",
    "https://mockuphone.com/images/devices_picture/apple-ipadpro11-spacegrey-portrait.png"], check=True)

print("=== iPhone 15 Pro ===")
iphone = find_screen_rect(f"{ASSETS}/iphone-frame.png")

print("\n=== MacBook Pro 14 ===")
macbook = find_screen_rect(f"{ASSETS}/macbook-frame.png")

print("\n=== iPad Pro 11 ===")
ipad = find_screen_rect(f"{ASSETS}/ipad-frame.png")
