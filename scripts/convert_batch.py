import sys
import os
import json
from PIL import Image

def main():
    if len(sys.argv) < 2:
        print("Usage: python convert_batch.py <json_mapping_file>")
        sys.exit(1)

    mapping_file = sys.argv[1]
    if not os.path.exists(mapping_file):
        print(f"Error: Mapping file '{mapping_file}' does not exist.")
        sys.exit(1)

    with open(mapping_file, 'r', encoding='utf-8') as f:
        mapping = json.load(f)

    for item in mapping:
        src = item['src']
        dest = item['dest']
        width = item['width']
        height = item['height']

        if not os.path.exists(src):
            print(f"Skipping: Source file '{src}' does not exist.")
            continue

        dest_dir = os.path.dirname(dest)
        if dest_dir:
            os.makedirs(dest_dir, exist_ok=True)

        try:
            with Image.open(src) as img:
                print(f"Converting {src} -> {dest} ({width}x{height})...")
                img_resized = img.resize((width, height), Image.Resampling.LANCZOS)
                
                ext = os.path.splitext(dest)[1].lower()
                if ext == '.webp':
                    fmt = 'WEBP'
                    quality = 85
                elif ext in ['.jpg', '.jpeg']:
                    fmt = 'JPEG'
                    quality = 90
                    if img_resized.mode in ('RGBA', 'LA'):
                        background = Image.new('RGB', img_resized.size, (5, 7, 15))
                        background.paste(img_resized, mask=img_resized.split()[3])
                        img_resized = background
                else:
                    fmt = ext.replace('.', '').upper()
                    quality = 90

                img_resized.save(dest, format=fmt, quality=quality)
        except Exception as e:
            print(f"Error converting {src}: {e}")

    print("Batch conversion completed!")

if __name__ == "__main__":
    main()
