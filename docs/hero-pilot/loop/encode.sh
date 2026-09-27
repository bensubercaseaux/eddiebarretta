#!/bin/zsh
# Rebuilds public/hero/ from the 4K upscale of take 1.
# Usage: ./encode.sh /path/to/take1-4k.mp4
# Needs ffmpeg with libx264 and libvpx-vp9, plus Python with Pillow and numpy.
# On 2026-09-27 ffmpeg came from Remotion's bundle, because none was installed:
#   FF=~/Websites/home/avantconcepts/marketing-videos/node_modules/@remotion/compositor-darwin-arm64
#   export DYLD_LIBRARY_PATH=$FF; export PATH=$FF:$PATH
set -e
SRC="$1"; HERE="${0:A:h}"; OUT="${HERE:h:h:h}/public/hero"; TMP="$(mktemp -d)"
mkdir -p "$OUT" "$TMP/fr"
ffmpeg -v error -y -i "$SRC" -vf "scale=1920:1080:flags=lanczos" "$TMP/fr/%04d.png"
(cd "$TMP" && python3 "$HERE/patch.py")
ffmpeg -v error -y -framerate 24 -i "$TMP/fr/%04d.png" -an -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -profile:v high -movflags +faststart "$OUT/hero-loop-1080.mp4"
ffmpeg -v error -y -framerate 24 -i "$TMP/fr/%04d.png" -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -pix_fmt yuv420p "$OUT/hero-loop-1080.webm"
ffmpeg -v error -y -framerate 24 -i "$TMP/fr/%04d.png" -an -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -profile:v high -movflags +faststart -vf "scale=1280:720:flags=lanczos" "$OUT/hero-loop-720.mp4"
ffmpeg -v error -y -framerate 24 -i "$TMP/fr/%04d.png" -an -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -pix_fmt yuv420p -vf "scale=1280:720:flags=lanczos" "$OUT/hero-loop-720.webm"
python3 - <<PY
from PIL import Image
im = Image.open("$TMP/fr/0001.png").convert("RGB")
im.save("$OUT/hero-poster-1080.jpg", quality=78, optimize=True, progressive=True)
PY
rm -rf "$TMP"; ls -la "$OUT"
