from PIL import Image
import os
import glob

artifacts_dir = r"C:\Users\hercules\.gemini\antigravity\brain\90c96f93-5c0f-48a8-9f70-c461a806cfc0"
assets_dir = r"C:\Users\hercules\Documents\projetos\vibe-code\the-miner-is-gone\public\assets"

os.makedirs(assets_dir, exist_ok=True)

files = glob.glob(os.path.join(artifacts_dir, "*.png"))

for file in files:
    filename = os.path.basename(file)
    # The files are named like runic_golem_1772805777168.png
    name = filename.rsplit("_", 1)[0]
    
    img = Image.open(file).convert("RGBA")
    
    # Find bounding box of non-white
    bbox = Image.eval(img.convert("L"), lambda x: 255 if x > 245 else 0).getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # Generate background mask (white or near-white)
    data = img.getdata()
    new_data = []
    for item in data:
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    
    # Scale down
    size = 64 if name == "runic_golem" else 32
    img = img.resize((size, size), Image.NEAREST)
    
    out_path = os.path.join(assets_dir, f"{name}.png")
    img.save(out_path, "PNG")
    print(f"Saved {out_path}")
