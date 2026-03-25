"""
Prepare web-ready assets:
1. Resize device frames to reasonable web sizes (transparent PNG)
2. Recapture screenshots is not needed - we'll use the originals
"""
from PIL import Image

ASSETS = "/home/user/workspace/jordanmcgowen/assets"

def resize_frame(input_path, output_path, target_width):
    img = Image.open(input_path).convert("RGBA")
    ratio = target_width / img.width
    new_size = (target_width, int(img.height * ratio))
    img = img.resize(new_size, Image.LANCZOS)
    img.save(output_path, "PNG", optimize=True)
    print(f"  {output_path}: {new_size}")

print("Resizing device frames for web...")

# iPhone: target ~400px wide for desktop display
resize_frame(f"{ASSETS}/iphone-frame.png", f"{ASSETS}/frame-iphone.png", 400)

# MacBook: target ~800px wide
resize_frame(f"{ASSETS}/macbook-frame.png", f"{ASSETS}/frame-macbook.png", 800)

# iPad: target ~500px wide
resize_frame(f"{ASSETS}/ipad-frame.png", f"{ASSETS}/frame-ipad.png", 500)

print("Done!")
