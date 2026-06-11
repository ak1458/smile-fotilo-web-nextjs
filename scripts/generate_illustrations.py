import os
import random
import math
from PIL import Image, ImageDraw, ImageFilter

def get_gradient_mask(w, h, cx, cy, r):
    # Generates a soft radial gradient mask
    mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(mask)
    # Draw concentric circles with fading opacity
    for i in range(r, 0, -5):
        alpha = int(255 * (1 - i / r) ** 2)
        draw.ellipse([cx - i, cy - i, cx + i, cy + i], fill=alpha)
    return mask.filter(ImageFilter.GaussianBlur(15))

def create_base(w=1200, h=630, seed=0):
    random.seed(seed)
    # Base dark navy background
    img = Image.new('RGB', (w, h), (5, 7, 15))
    draw = ImageDraw.Draw(img)
    
    # Draw a subtle tech grid
    grid_size = 40
    for x in range(0, w, grid_size):
        draw.line([(x, 0), (x, h)], fill=(12, 17, 35), width=1)
    for y in range(0, h, grid_size):
        draw.line([(0, y), (w, y)], fill=(12, 17, 35), width=1)
        
    # Draw 1-2 soft radial glows
    # Indigo glow
    cx = random.randint(int(w * 0.2), int(w * 0.8))
    cy = random.randint(int(h * 0.2), int(h * 0.8))
    r = random.randint(200, 400)
    indigo_mask = get_gradient_mask(w, h, cx, cy, r)
    indigo_layer = Image.new('RGB', (w, h), (79, 70, 229)) # #4f46e5
    img.paste(indigo_layer, (0, 0), indigo_mask)
    
    # Cyan glow (smaller, accent)
    cx2 = cx + random.randint(-150, 150)
    cy2 = cy + random.randint(-150, 150)
    r2 = random.randint(100, 200)
    cyan_mask = get_gradient_mask(w, h, cx2, cy2, r2)
    cyan_layer = Image.new('RGB', (w, h), (6, 182, 212)) # #06b6d4
    img.paste(cyan_layer, (0, 0), cyan_mask)
    
    return img

def draw_scene_2_shopping_cart(draw, w, h, seed):
    # Scene 2: Shopping cart & checkout cards
    random.seed(seed)
    # Floating checkout card
    card_w, card_h = 240, 150
    cx, cy = w // 2, h // 2
    
    # Lighter background card
    draw.rounded_rectangle([cx - card_w//2, cy - card_h//2, cx + card_w//2, cy + card_h//2], 
                           radius=12, fill=(15, 23, 42, 150), outline=(79, 70, 229), width=2)
    
    # Cart icon outline
    cart_x = cx - 40
    cart_y = cy - 20
    draw.line([(cart_x, cart_y), (cart_x + 15, cart_y), (cart_x + 25, cart_y + 30), 
               (cart_x + 65, cart_y + 30), (cart_x + 75, cart_y), (cart_x + 15, cart_y)], fill=(6, 182, 212), width=3)
    draw.ellipse([cart_x + 25, cart_y + 38, cart_x + 35, cart_y + 48], fill=(6, 182, 212))
    draw.ellipse([cart_x + 55, cart_y + 38, cart_x + 65, cart_y + 48], fill=(6, 182, 212))
    
    # Success checkmark circle
    check_cx = cx + 50
    check_cy = cy + 20
    draw.ellipse([check_cx - 20, check_cy - 20, check_cx + 20, check_cy + 20], fill=(79, 70, 229))
    draw.line([(check_cx - 8, check_cy), (check_cx - 2, check_cy + 6), (check_cx + 8, check_cy - 6)], fill=(255, 255, 255), width=3)
    
    # Floating elements
    for i in range(4):
        fx = cx + random.randint(-200, 200)
        fy = cy + random.randint(-180, 180)
        fr = random.randint(15, 30)
        draw.ellipse([fx - fr, fy - fr, fx + fr, fy + fr], outline=(79, 70, 229), width=1)
        if random.choice([True, False]):
            draw.line([(fx - 5, fy), (fx + 5, fy)], fill=(6, 182, 212), width=2)
            draw.line([(fx, fy - 5), (fx, fy + 5)], fill=(6, 182, 212), width=2)

def draw_scene_3_designer_flatlay(draw, w, h, seed):
    # Scene 3: Floating swatches, logo grid sketch, typography specimens
    random.seed(seed)
    cx, cy = w // 2, h // 2
    
    # Draw drafting grid lines
    for angle in [0, 45, 90, 135]:
        rad = math.radians(angle)
        dx = int(180 * math.cos(rad))
        dy = int(180 * math.sin(rad))
        draw.line([(cx - dx, cy - dy), (cx + dx, cy + dy)], fill=(79, 70, 229, 80), width=1)
        
    # Draw a central circle sketch
    draw.ellipse([cx - 100, cy - 100, cx + 100, cy + 100], outline=(6, 182, 212), width=2)
    draw.rectangle([cx - 80, cy - 80, cx + 80, cy + 80], outline=(79, 70, 229), width=1)
    
    # Color swatches
    swatches = [
        (cx - 220, cy - 100, (79, 70, 229)),
        (cx - 220, cy - 40, (6, 182, 212)),
        (cx - 220, cy + 20, (255, 255, 255)),
        (cx + 160, cy - 80, (79, 70, 229)),
        (cx + 160, cy - 20, (6, 182, 212)),
    ]
    for sx, sy, color in swatches:
        draw.rounded_rectangle([sx, sy, sx + 50, sy + 40], radius=4, fill=color)

def draw_scene_4_step_path(draw, w, h, seed):
    # Scene 4: Numbered step path winding with checkmarks
    random.seed(seed)
    cx, cy = w // 2, h // 2
    
    # Draw a winding path (wave pattern)
    points = []
    for x in range(cx - 300, cx + 301, 10):
        y = cy + int(60 * math.sin((x - cx) / 100.0))
        points.append((x, y))
    
    # Draw path line
    draw.line(points, fill=(79, 70, 229), width=3)
    
    # Draw checkpoints
    checkpoints = [
        points[0],
        points[len(points) // 3],
        points[2 * len(points) // 3],
        points[-1]
    ]
    
    for idx, (px, py) in enumerate(checkpoints):
        # Outline circle
        draw.ellipse([px - 20, py - 20, px + 20, py + 20], fill=(15, 23, 42), outline=(6, 182, 212), width=2)
        # Glow active ones
        if idx < 3:
            draw.line([(px - 6, py), (px - 2, py + 4), (px + 6, py - 4)], fill=(6, 182, 212), width=3)
        else:
            # Drawing dot
            draw.ellipse([px - 4, py - 4, px + 4, py + 4], fill=(79, 70, 229))

def draw_scene_5_search_results(draw, w, h, seed):
    # Scene 5: Stylized search results with glowing rising element
    random.seed(seed)
    cx, cy = w // 2, h // 2
    
    # Search bar at top
    sb_w, sb_h = 400, 36
    draw.rounded_rectangle([cx - sb_w//2, cy - 140, cx + sb_w//2, cy - 104], radius=18, 
                           fill=(15, 23, 42), outline=(79, 70, 229), width=2)
    # Search icon
    draw.ellipse([cx - sb_w//2 + 15, cy - 126, cx - sb_w//2 + 25, cy - 116], outline=(6, 182, 212), width=2)
    draw.line([cx - sb_w//2 + 23, cy - 118, cx - sb_w//2 + 28, cy - 113], fill=(6, 182, 212), width=2)
    
    # Search results blocks
    y_starts = [cy - 50, cy + 10, cy + 70]
    for idx, y_start in enumerate(y_starts):
        res_w, res_h = 360, 44
        rx = cx - res_w // 2
        ry = y_start
        
        if idx == 1: # The glowing rising result
            ry -= 12 # shifted up
            # Glow backing rounded rectangle
            draw.rounded_rectangle([rx - 4, ry - 4, rx + res_w + 4, ry + res_h + 4], radius=8,
                                   fill=(79, 70, 229, 50))
            draw.rounded_rectangle([rx, ry, rx + res_w, ry + res_h], radius=6,
                                   fill=(15, 23, 42), outline=(6, 182, 212), width=2)
            # Draw content lines inside (cyan/white)
            draw.line([(rx + 15, ry + 15), (rx + 200, ry + 15)], fill=(6, 182, 212), width=4)
            draw.line([(rx + 15, ry + 27), (rx + 120, ry + 27)], fill=(255, 255, 255), width=3)
            # Rising arrow or graph line
            draw.line([(rx + res_w - 40, ry + 22), (rx + res_w - 20, ry + 22)], fill=(6, 182, 212), width=2)
            draw.line([(rx + res_w - 20, ry + 22), (rx + res_w - 28, ry + 14)], fill=(6, 182, 212), width=2)
            draw.line([(rx + res_w - 20, ry + 22), (rx + res_w - 28, ry + 30)], fill=(6, 182, 212), width=2)
        else:
            # Regular results
            draw.rounded_rectangle([rx, ry, rx + res_w, ry + res_h], radius=6,
                                   fill=(15, 23, 42), outline=(15, 23, 42), width=1)
            # Draw content lines (faint)
            draw.line([(rx + 15, ry + 15), (rx + 180, ry + 15)], fill=(79, 70, 229), width=4)
            draw.line([(rx + 15, ry + 27), (rx + 90, ry + 27)], fill=(12, 17, 35), width=3)

def draw_scene_6_circuit_ui(draw, w, h, seed):
    # Scene 6: Circuit board lines and floating transparent UI panels
    random.seed(seed)
    cx, cy = w // 2, h // 2
    
    # Draw circuit traces
    for i in range(6):
        x0 = random.randint(cx - 300, cx + 300)
        y0 = random.randint(cy - 200, cy + 200)
        dx = random.choice([-80, 80])
        dy = random.choice([-80, 80])
        draw.line([(x0, y0), (x0 + dx, y0)], fill=(79, 70, 229, 100), width=2)
        draw.line([(x0 + dx, y0), (x0 + dx + dy, y0 + dy)], fill=(6, 182, 212, 100), width=2)
        draw.ellipse([x0 - 4, y0 - 4, x0 + 4, y0 + 4], fill=(6, 182, 212))
        draw.ellipse([x0 + dx + dy - 4, y0 + dy - 4, x0 + dx + dy + 4, y0 + dy + 4], fill=(79, 70, 229))
        
    # Floating UI Panel
    panel_w, panel_h = 320, 200
    px, py = cx - panel_w // 2, cy - panel_h // 2
    draw.rounded_rectangle([px, py, px + panel_w, py + panel_h], radius=10,
                           fill=(15, 23, 42, 120), outline=(6, 182, 212), width=2)
    # Lighter header
    draw.rounded_rectangle([px, py, px + panel_w, py + 30], radius=10, fill=(30, 41, 59, 150))
    # Code fragment lines
    line_y = py + 50
    for j in range(5):
        lw = random.randint(80, 200)
        draw.line([(px + 20, line_y), (px + 20 + lw, line_y)], fill=(79, 70, 229), width=3)
        line_y += 20

def draw_scene_7_browser_mockup(draw, w, h, seed):
    # Scene 7: Browser window mockup floating
    random.seed(seed)
    cx, cy = w // 2, h // 2
    
    bw, bh = 560, 340
    bx, by = cx - bw // 2, cy - bh // 2
    
    # Outer frame
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=8,
                           fill=(15, 23, 42, 180), outline=(79, 70, 229), width=2)
    # Header bar
    draw.rounded_rectangle([bx, by, bx + bw, by + 32], radius=8, fill=(30, 41, 59, 200))
    
    # Control dots (Red, Yellow, Green)
    draw.ellipse([bx + 12, by + 10, bx + 22, by + 20], fill=(239, 68, 68)) # Red
    draw.ellipse([bx + 28, by + 10, bx + 38, by + 20], fill=(245, 158, 11)) # Yellow
    draw.ellipse([bx + 44, by + 10, bx + 54, by + 20], fill=(16, 185, 129)) # Green
    
    # Lighter address bar mockup
    draw.rounded_rectangle([bx + 70, by + 6, bx + bw - 20, by + 26], radius=4, fill=(15, 23, 42))
    
    # Mock content (wireframe blocks)
    draw.rounded_rectangle([bx + 20, by + 50, bx + bw - 20, by + bh - 20], radius=4,
                           outline=(6, 182, 212), width=1)
    
    # Two columns inside wireframe
    col_w = (bw - 60) // 2
    draw.rectangle([bx + 30, by + 70, bx + 30 + col_w, by + 240], outline=(79, 70, 229), width=1)
    draw.rectangle([bx + 30 + col_w + 10, by + 70, bx + bw - 30, by + 240], outline=(79, 70, 229), width=1)

def draw_aurora(draw, w, h, seed):
    # Aurora theme (2560x1440 background)
    random.seed(seed)
    # Subtle space grid
    grid_size = 80
    for x in range(0, w, grid_size):
        draw.line([(x, 0), (x, h)], fill=(10, 15, 30), width=1)
    for y in range(0, h, grid_size):
        draw.line([(0, y), (w, y)], fill=(10, 15, 30), width=1)

def main():
    mappings = [
        # Scene 4: Numbered step path
        ('cro.webp', 4, 1200, 630),
        # Scene 2: Floating shopping cart
        ('payments.webp', 2, 1200, 630),
        # Scene 3: Floating swatches
        ('linkedin.webp', 3, 1200, 630),
        # Scene 5: Stylized search results
        ('seo-cost.webp', 5, 1200, 630),
        ('geo.webp', 5, 1200, 630),
        ('local-seo.webp', 5, 1200, 630),
        ('gbp.webp', 5, 1200, 630),
        ('onpage.webp', 5, 1200, 630),
        ('keywords.webp', 5, 1200, 630),
        ('link-building.webp', 5, 1200, 630),
        ('audit.webp', 5, 1200, 630),
        ('ads-vs-seo.webp', 5, 1200, 630),
        ('content.webp', 5, 1200, 630),
        ('seo-audit.webp', 5, 1200, 630),
        ('web-design.webp', 5, 1200, 630),
        # Scene 6: Circuit UI
        ('ai-design.webp', 6, 1200, 630),
        ('dev-trends.webp', 6, 1200, 630),
        ('frameworks.webp', 6, 1200, 630),
        ('webflow.webp', 6, 1200, 630),
        ('headless.webp', 6, 1200, 630),
        ('pwa.webp', 6, 1200, 630),
        ('security.webp', 6, 1200, 630),
        ('hosting.webp', 6, 1200, 630),
        ('accessibility.webp', 6, 1200, 630),
        ('vitals.webp', 6, 1200, 630),
        # Scene 7: Browser mockup
        ('cost.webp', 7, 1200, 630),
        ('lucknow.webp', 7, 1200, 630),
        ('gonda-hero.jpg', 7, 1200, 630),
        ('responsive.webp', 7, 1200, 630),
        ('noida.webp', 7, 1200, 630),
        ('ayodhya.webp', 7, 1200, 630),
        ('speed.webp', 7, 1200, 630),
        ('ecommerce.webp', 7, 1200, 630),
        ('nextjs.webp', 7, 1200, 630),
        ('wordpress.webp', 7, 1200, 630),
        # Special Site Images
        ('hero-aurora.webp', 8, 2560, 1440),
        ('og-default.webp', 9, 1200, 630)
    ]

    for idx, (filename, scene, w, h) in enumerate(mappings):
        print(f"Generating programmatic image: {filename}...")
        # Create base image with randomized glows using filename seed
        seed_val = hash(filename) + idx
        img = create_base(w, h, seed_val)
        draw = ImageDraw.Draw(img, 'RGBA')
        
        # Apply specific scene drawing
        if scene == 2:
            draw_scene_2_shopping_cart(draw, w, h, seed_val)
        elif scene == 3:
            draw_scene_3_designer_flatlay(draw, w, h, seed_val)
        elif scene == 4:
            draw_scene_4_step_path(draw, w, h, seed_val)
        elif scene == 5:
            draw_scene_5_search_results(draw, w, h, seed_val)
        elif scene == 6:
            draw_scene_6_circuit_ui(draw, w, h, seed_val)
        elif scene == 7:
            draw_scene_7_browser_mockup(draw, w, h, seed_val)
        elif scene == 8:
            draw_aurora(draw, w, h, seed_val)
        elif scene == 9:
            # OG Default: just grid and soft glow
            draw_scene_3_designer_flatlay(draw, w, h, seed_val)
            
        # Determine saving path
        if filename in ['hero-aurora.webp', 'og-default.webp']:
            dest_path = os.path.join('public', filename)
        else:
            dest_path = os.path.join('public', 'blog', filename)
            
        ext = os.path.splitext(filename)[1].lower()
        if ext == '.webp':
            fmt = 'WEBP'
            quality = 85
        elif ext in ['.jpg', '.jpeg']:
            fmt = 'JPEG'
            quality = 90
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (5, 7, 15))
                background.paste(img, mask=img.split()[3])
                img = background
        else:
            fmt = ext.replace('.', '').upper()
            quality = 90
            
        # Save image
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        img.save(dest_path, format=fmt, quality=quality)
        print(f"Successfully saved to {dest_path}")

if __name__ == '__main__':
    main()
