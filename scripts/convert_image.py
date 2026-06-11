import sys
import os
from PIL import Image

def main():
    if len(sys.argv) < 5:
        print("Usage: python convert_image.py <src_path> <dest_path> <width> <height>")
        sys.exit(1)

    src_path = sys.argv[1]
    dest_path = sys.argv[2]
    width = int(sys.argv[3])
    height = int(sys.argv[4])

    if not os.path.exists(src_path):
        print(f"Error: Source file '{src_path}' does not exist.")
        sys.exit(1)

    # Ensure destination directory exists
    dest_dir = os.path.dirname(dest_path)
    if dest_dir:
        os.makedirs(dest_dir, exist_ok=True)

    print(f"Opening '{src_path}'...")
    with Image.open(src_path) as img:
        print(f"Resizing from {img.size} to ({width}, {height})...")
        img_resized = img.resize((width, height), Image.Resampling.LANCZOS)
        
        # Determine format from extension
        ext = os.path.splitext(dest_path)[1].lower()
        if ext == '.webp':
            fmt = 'WEBP'
            quality = 85
        elif ext in ['.jpg', '.jpeg']:
            fmt = 'JPEG'
            quality = 90
            # Convert to RGB if needed (JPEG doesn't support RGBA)
            if img_resized.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img_resized.size, (5, 7, 15)) # #05070f background
                background.paste(img_resized, mask=img_resized.split()[3]) # 3 is the alpha channel
                img_resized = background
        else:
            fmt = ext.replace('.', '').upper()
            quality = 90

        print(f"Saving to '{dest_path}' as {fmt} with quality {quality}...")
        img_resized.save(dest_path, format=fmt, quality=quality)
        print("Done!")

if __name__ == "__main__":
    main()
