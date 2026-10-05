#!/usr/bin/env bash
# Renders the social material from docs/brand/material.html into docs/brand/material/.
# Needs a Chromium-based browser (Edge, Brave, Chrome or Chromium) and python3 with Pillow.
# Works from Git Bash on Windows and from Linux/macOS.
set -euo pipefail

cd "$(dirname "$0")"
mkdir -p material

find_browser() {
  for c in msedge brave-browser google-chrome chromium \
    "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
    "/c/Program Files/Google/Chrome/Application/chrome.exe"; do
    if command -v "$c" >/dev/null 2>&1; then command -v "$c"; return; fi
    if [ -x "$c" ]; then echo "$c"; return; fi
  done
  echo "No Chromium-based browser found; set BROWSER=<path>" >&2
  exit 1
}
BROWSER=${BROWSER:-$(find_browser)}

# file:// URL that the browser understands on every platform (C:/... on Windows).
HERE=$PWD
command -v cygpath >/dev/null 2>&1 && HERE=$(cygpath -m "$PWD")

declare -A SIZES=(
  [post-wera]=1080,1350
  [carrusel-1]=1080,1350
  [carrusel-2]=1080,1350
  [carrusel-3]=1080,1350
  [carrusel-4]=1080,1350
  [historia-guia]=1080,1920
  [tiktok-cierre]=1080,1920
  [post-tip]=1080,1080
  [oscuro-chat]=1080,1350
  [naranja-gratis]=1080,1080
  [foto-swipe]=1080,1350
  [split-checklist]=1080,1080
  [historia-mito]=1080,1920
  [historia-perfil]=1080,1920
  [lugares]=1080,1080
  [club]=1080,1350
  [cafe-pasos]=1080,1350
  [cafe-gratis]=1080,1080
  [cafe-radio]=1080,1080
  [cafe-privacidad]=1080,1350
  [cafe-instalar]=1080,1920
  [cafe-amigos]=1080,1080
  [cafe-cta]=1080,1350
  [cafe-guias]=1080,1920
)

ONLY=${1:-}
for f in "${!SIZES[@]}"; do
  [ -n "$ONLY" ] && [ "$f" != "$ONLY" ] && continue
  "$BROWSER" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --allow-file-access-from-files --virtual-time-budget=3000 \
    --window-size="${SIZES[$f]}" --screenshot="$HERE/material/$f.png" \
    "file:///$HERE/material.html?f=$f" >/dev/null 2>&1
  echo "material/$f.png (${SIZES[$f]/,/x})"
done

# Email signature preview, rendered from its own file with the local logo.
if [ -z "$ONLY" ] || [ "$ONLY" = firma-preview ]; then
  "$BROWSER" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2     --allow-file-access-from-files --virtual-time-budget=3000     --window-size=640,190 --screenshot="$HERE/material/firma-preview.png"     "file:///$HERE/firma-correo.html?preview=1" >/dev/null 2>&1
  echo "material/firma-preview.png (1280x380)"
fi

# Lossless recompression; the networks re-encode anyway, so smaller uploads are enough.
# A file open in a viewer is skipped instead of aborting the run.
ONLY="$ONLY" python - <<'PY'
from PIL import Image
import glob, os
only = os.environ.get('ONLY')
for path in glob.glob(f"material/{only or '*'}.png"):
    try:
        Image.open(path).convert('RGB').save(path, optimize=True)
    except OSError as e:
        print(f"skip {path}: {e}")
PY
