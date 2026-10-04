#!/usr/bin/env bash
# Renders the social media kit from docs/brand/redes.html into docs/brand/redes/.
# Needs a Chromium-based browser (Brave, Chrome or Chromium) and python3 with Pillow.
set -euo pipefail

cd "$(dirname "$0")"
BROWSER=${BROWSER:-$(command -v brave-browser || command -v google-chrome || command -v chromium)}
mkdir -p redes

declare -A SIZES=(
  [perfil]=1080,1080
  [post]=1080,1080
  [post-vertical]=1080,1350
  [historia]=1080,1920
  [portada-facebook]=1640,624
  [portada-x]=1500,500
  [portada-linkedin]=1128,191
  [portada-youtube]=2560,1440
)

for f in "${!SIZES[@]}"; do
  "$BROWSER" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --allow-file-access-from-files --virtual-time-budget=3000 \
    --window-size="${SIZES[$f]}" --screenshot="$PWD/redes/$f.png" \
    "file://$PWD/redes.html?f=$f" >/dev/null 2>&1
  echo "redes/$f.png (${SIZES[$f]/,/x})"
done

# Lossless recompression; the networks re-encode anyway, so smaller uploads are enough.
python3 - <<'EOF'
from PIL import Image
import glob
for path in glob.glob('redes/*.png'):
    Image.open(path).convert('RGB').save(path, optimize=True)
EOF
