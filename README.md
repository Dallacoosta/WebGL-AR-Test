# CFD AR Viewer — Deployment Guide

## Files
| File | Purpose |
|------|---------|
| `index.html` | Main AR application (self-contained) |
| `marker.png` | AR target marker — print or display on screen |

## How to deploy

### Option A — GitHub Pages (free, HTTPS required for camera)
1. Create a GitHub repo, upload both files
2. Go to Settings → Pages → Deploy from branch (main / root)
3. Visit `https://yourusername.github.io/your-repo/`

### Option B — Netlify (drag & drop)
1. Go to https://netlify.com → "Add new site" → "Deploy manually"
2. Drag the `cfd-ar/` folder into the drop zone
3. Done — you get an HTTPS URL instantly

### Option C — Any static host (Vercel, Cloudflare Pages, S3+CloudFront)
Upload both files to the same directory. Must be served over HTTPS.

## Using the app
1. Open the URL on your phone
2. Tap **Launch AR Camera** and allow camera access
3. Print `marker.png` (at least 10×10 cm) or display it on a monitor
4. Point your phone camera at the marker
5. The CFD simulation appears anchored to the marker
6. Use **▶ PLAY / ⏸ PAUSE**, **◀◀ / ▶▶**, speed selector, and timeline scrubber

## Replacing the demo CFD data with your own

In `index.html`, find the function `buildCFDFrames(N)`.
Each frame returns a `THREE.Group` containing your geometry for that timestep.

### Loading external data (e.g. VTK/JSON exported from OpenFOAM/Fluent):
```javascript
async function loadCFDData() {
  const resp  = await fetch('cfd_data.json');   // your exported file
  const data  = await resp.json();              // array of timesteps
  const frames = data.map(step => {
    const group = new THREE.Group();
    // build geometry from step.vertices, step.velocities, step.pressure ...
    return group;
  });
  return frames;
}
```
Call `loadCFDData()` inside `initCFD()` and await the result before calling `showStep(0)`.

## AR Marker
The `marker.png` file is this app's custom marker.
- Print at ≥10 cm × 10 cm for reliable detection up to ~1 m distance
- Matte paper works better than glossy (reduces glare)
- Works indoors under normal lighting; avoid very dark or overexposed environments
- The app uses AR.js with the `hiro` preset — you can also switch to
  `pattern` mode and upload a custom `.patt` file generated at
  https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
