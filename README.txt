SETUP — do this once
=====================

1. Download these 3 files and put them in this folder:

   aframe.min.js
   → https://cdn.jsdelivr.net/npm/aframe@1.4.2/dist/aframe.min.js

   aframe-ar.js
   → https://cdn.jsdelivr.net/npm/ar.js@2.2.2/aframe/build/aframe-ar.js

   hiro.png  (the AR marker image)
   → https://cdn.jsdelivr.net/npm/ar.js@2.2.2/data/images/hiro.png

2. Your folder should look like this:
   index.html
   vercel.json
   aframe.min.js      ← downloaded
   aframe-ar.js       ← downloaded
   hiro.png           ← downloaded
   model.gltf         ← your CFD model
   model.bin          ← your CFD model binary

3. Push everything to GitHub → Vercel redeploys automatically.

4. Open the Vercel URL → tap Open Camera → point at hiro.png.

TUNING THE MODEL SIZE
======================
In index.html find:  scale="0.05 0.05 0.05"
- Too small → increase: 0.1, 0.5, 1.0
- Too big   → decrease: 0.01, 0.001
