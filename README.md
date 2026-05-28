# CFD · AR Viewer

Visualize CFD simulations in Augmented Reality — works on phone, tablet, and desktop.

---

## Setup in 5 steps

### 1. Generate your marker image

Go to: **https://hiukim.github.io/mind-ar-js-doc/tools/compile**

- Upload any image you want as your AR marker (a logo, a project label, etc.)
- Click **Start** → download the `targets.mind` file
- Also save the image you uploaded as `marker.png`
- Put both files in the root of this repo

### 2. Export GLB files from ParaView

For each time step:

1. Load your CFD data in ParaView
2. Apply filters → **Decimate** (target ~50,000 polygons for AR)
3. Color by your variable (pressure, velocity magnitude, etc.)
4. **File → Export Scene → GLB**
5. Name files: `step_001.glb`, `step_002.glb`, ... `step_050.glb`

For a **static simulation** with one result: just export one file as `step_001.glb`.

### 3. Upload GLB files to GitHub Releases

1. Go to your GitHub repo → **Releases → Create a new release**
2. Tag: `v1.0` (or any tag)
3. Drag and drop all your `.glb` files
4. Publish release
5. Right-click each file → **Copy link address** — these are your CDN URLs

### 4. Edit manifest.json

Update `manifest.json` with your file URLs:

```json
{
  "steps": [
    { "url": "https://github.com/YOUR_USER/YOUR_REPO/releases/download/v1.0/step_001.glb", "label": "t = 0.0s" },
    { "url": "https://github.com/YOUR_USER/YOUR_REPO/releases/download/v1.0/step_002.glb", "label": "t = 0.5s" }
  ]
}
```

For a **static simulation** with one step, just put one entry in the array — the play/pause controls will automatically hide.

### 5. Deploy

Push everything to GitHub — Vercel auto-deploys.

Your repo should look like:
```
index.html
manifest.json
marker.png
targets.mind
vercel.json
README.md
```

---

## Controls

| Action | Gesture |
|--------|---------|
| Scale model | Pinch (two fingers) |
| Rotate model | Drag (one finger) |
| Next step | ▶▶ button or tap track |
| Play/Pause | ▶ PLAY button |
| Desktop rotate | Mouse drag |
| Desktop scale | Mouse wheel |

---

## ParaView tips for AR

- **Decimate aggressively** — AR doesn't need scientific accuracy in polygon count. Target 20k–100k polygons per step
- **Use surface representation** — volume rendering won't export to GLB. Use Contour filter for iso-surfaces
- **Bake colors** — make sure to include color data in the GLB export (check "Include Color" in export options)
- **DRACO compression** — if you install the `draco_encoder` tool, compress your GLBs with `draco_compression` for 10x smaller files. The viewer supports DRACO automatically
