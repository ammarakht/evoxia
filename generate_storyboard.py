from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

artifact_dir = r"C:\Users\HP\.gemini\antigravity-ide\brain\a819c2c0-be63-481a-bca3-3c8a91500714"
out_path = os.path.join(artifact_dir, "walking_robot_sheet_lift_storyboard.png")

# Dimensions: 1920x1080 Storyboard
W, H = 1920, 1080
canvas = Image.new("RGBA", (W, H), (0, 0, 0, 255))
draw = ImageDraw.Draw(canvas)

# Background subtle ambient glow
for r in range(400, 0, -20):
    alpha = int(12 * (1 - r / 400))
    draw.ellipse([(W//2 - r, H//2 - r), (W//2 + r, H//2 + r)], fill=(20, 35, 60, alpha))

# 3 Panels: Stage 1, Stage 2, Stage 3
panel_w = 560
panel_h = 760
panel_y = 200
spacing = 50
margin_x = (W - (3 * panel_w + 2 * spacing)) // 2

# Load fonts
try:
    title_font = ImageFont.truetype("arial.ttf", 36)
    stage_font = ImageFont.truetype("arial.ttf", 20)
    brand_font = ImageFont.truetype("georgia.ttf", 38)
    sub_font = ImageFont.truetype("arial.ttf", 15)
except:
    title_font = ImageFont.load_default()
    stage_font = title_font
    brand_font = title_font
    sub_font = title_font

# Header
draw.text((W//2, 70), "EVOXIA — CINEMATIC ROBOT INTRO & SHEET LIFT REVEAL", fill=(255, 255, 255), font=title_font, anchor="mm")
draw.text((W//2, 115), "Minimalist 3-Step Sequence: Walking Robot -> Tactile Click -> Upward Sheet Lift", fill=(160, 160, 160), font=sub_font, anchor="mm")

# --- PANEL 1: Walking Robot Approach ---
p1_x = margin_x
draw.rounded_rectangle([(p1_x, panel_y), (p1_x + panel_w, panel_y + panel_h)], radius=16, fill=(5, 5, 8, 255), outline=(60, 60, 70, 255), width=2)
# Text label
draw.text((p1_x + panel_w//2, panel_y + 40), "STEP 1: WALKING FORWARD (0.0s - 2.0s)", fill=(147, 197, 253), font=stage_font, anchor="mm")
draw.text((p1_x + panel_w//2, panel_y + 70), "Minimalist screen: Only walking robot & Evoxia", fill=(130, 130, 130), font=sub_font, anchor="mm")

# Draw robot silhouette walking in distance
center_x = p1_x + panel_w//2
draw.ellipse([(center_x - 30, panel_y + 260), (center_x + 30, panel_y + 320)], fill=(180, 195, 215)) # Head
draw.ellipse([(center_x - 12, panel_y + 285), (center_x - 4, panel_y + 293)], fill=(96, 165, 250)) # Eye L
draw.ellipse([(center_x + 4, panel_y + 285), (center_x + 12, panel_y + 293)], fill=(96, 165, 250)) # Eye R
# Torso
draw.polygon([(center_x - 45, panel_y + 330), (center_x + 45, panel_y + 330), (center_x + 30, panel_y + 460), (center_x - 30, panel_y + 460)], fill=(100, 116, 139))
# Walking legs
draw.line([(center_x - 20, panel_y + 460), (center_x - 40, panel_y + 560)], fill=(148, 163, 184), width=12) # Leg L
draw.line([(center_x + 20, panel_y + 460), (center_x + 35, panel_y + 540)], fill=(100, 116, 139), width=12) # Leg R
# Brand Wordmark below
draw.text((center_x, panel_y + 640), "Evoxia", fill=(255, 255, 255), font=brand_font, anchor="mm")


# --- PANEL 2: Tactile Fingertip Click ---
p2_x = margin_x + panel_w + spacing
draw.rounded_rectangle([(p2_x, panel_y), (p2_x + panel_w, panel_y + panel_h)], radius=16, fill=(5, 5, 8, 255), outline=(96, 165, 250, 255), width=2)
draw.text((p2_x + panel_w//2, panel_y + 40), "STEP 2: TACTILE CLICK (2.0s - 2.4s)", fill=(147, 197, 253), font=stage_font, anchor="mm")
draw.text((p2_x + panel_w//2, panel_y + 70), "Robotic finger clicks Evoxia -> Ignition Spark", fill=(130, 130, 130), font=sub_font, anchor="mm")

center_x2 = p2_x + panel_w//2
# Large Close-up Robot Arm & Hand reaching
draw.polygon([(center_x2 - 120, panel_y + 200), (center_x2 - 40, panel_y + 200), (center_x2 - 20, panel_y + 380), (center_x2 - 80, panel_y + 380)], fill=(148, 163, 184)) # Forearm
draw.ellipse([(center_x2 - 45, panel_y + 380), (center_x2 + 15, panel_y + 430)], fill=(203, 213, 225)) # Palm
# Index finger touching
draw.line([(center_x2 - 10, panel_y + 410), (center_x2, panel_y + 480)], fill=(241, 245, 249), width=16) # Finger
# Contact ignition spark
spark_y = panel_y + 485
for radius in [40, 25, 12]:
    draw.ellipse([(center_x2 - radius, spark_y - radius), (center_x2 + radius, spark_y + radius)], fill=(96, 165, 250, 80))
draw.ellipse([(center_x2 - 6, spark_y - 6), (center_x2 + 6, spark_y + 6)], fill=(255, 255, 255))
# Brand Wordmark being touched
draw.text((center_x2, spark_y + 50), "Evoxia", fill=(255, 255, 255), font=brand_font, anchor="mm")


# --- PANEL 3: Upward Sheet Lift (Curtain Transition) ---
p3_x = margin_x + 2 * (panel_w + spacing)
draw.rounded_rectangle([(p3_x, panel_y), (p3_x + panel_w, panel_y + panel_h)], radius=16, fill=(12, 12, 16, 255), outline=(60, 60, 70, 255), width=2)
draw.text((p3_x + panel_w//2, panel_y + 40), "STEP 3: SHEET LIFT (2.4s - 3.2s)", fill=(147, 197, 253), font=stage_font, anchor="mm")
draw.text((p3_x + panel_w//2, panel_y + 70), "Black sheet slides UP revealing the website", fill=(130, 130, 130), font=sub_font, anchor="mm")

# Revealed website background inside Panel 3 (lower 60%)
center_x3 = p3_x + panel_w//2
draw.rectangle([(p3_x + 20, panel_y + 260), (p3_x + panel_w - 20, panel_y + panel_h - 20)], fill=(18, 18, 24))
# Mockup website header
draw.rectangle([(p3_x + 40, panel_y + 280), (p3_x + panel_w - 40, panel_y + 310)], fill=(28, 28, 36))
draw.text((p3_x + 60, panel_y + 295), "Evoxia.studio", fill=(255, 255, 255), font=sub_font, anchor="lm")
# Mockup website hero cards
draw.rectangle([(p3_x + 40, panel_y + 340), (p3_x + panel_w - 40, panel_y + 460)], fill=(24, 24, 32), outline=(50, 50, 60))
draw.text((center_x3, panel_y + 380), "Crafting Digital Products", fill=(255, 255, 255), font=stage_font, anchor="mm")
draw.text((center_x3, panel_y + 415), "Web Development | Mobile Apps | UI/UX", fill=(140, 140, 140), font=sub_font, anchor="mm")

# Black Sheet sliding UP (Covering top 35% and moving upward)
sheet_bottom = panel_y + 250
draw.rectangle([(p3_x, panel_y), (p3_x + panel_w, sheet_bottom)], fill=(0, 0, 0))
# Upward motion arrows
draw.text((center_x3, sheet_bottom - 45), "^   ^   ^   ^   ^", fill=(96, 165, 250), font=stage_font, anchor="mm")
draw.text((center_x3, sheet_bottom - 20), "SLIDING UPWARD (SHEET LIFT)", fill=(200, 200, 200), font=sub_font, anchor="mm")
# Sheet bottom glowing edge
draw.line([(p3_x, sheet_bottom), (p3_x + panel_w, sheet_bottom)], fill=(96, 165, 250), width=3)


canvas.save(out_path, "PNG")
print("Saved storyboard image to:", out_path)
