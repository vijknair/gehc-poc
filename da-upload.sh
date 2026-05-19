#!/bin/bash
set -e

# ---------------------------------------------------------------------------
# Usage: ./da-upload.sh <site-name> <content-folder> [site-origin]
#   e.g. ./da-upload.sh gehc-poc content/gehc
#        ./da-upload.sh gehc-poc content/gehc https://www.gehealthcare.com
#
# site-origin (optional): base URL used to resolve relative image paths in
#   content HTML (e.g. /media/img.jpg → https://example.com/media/img.jpg).
#   Only needed if the content contains relative image references.
#
# Prerequisites — create a .env file in this directory:
#   DA_TOKEN=<your-token>
#
# How to get the DA_TOKEN:
#   1. Open https://da.live and navigate to your site's content source
#   2. Open DevTools (F12) → Network tab
#   3. Filter requests by "admin.da.live"
#   4. Click any GET request
#   5. Under Request Headers, copy the value after "Authorization: Bearer "
#   6. Paste it into .env as: DA_TOKEN=<paste-here>
#
# Note: the token expires periodically — repeat the steps above if you get 401.
# ---------------------------------------------------------------------------
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <site-name> <content-folder> [site-origin]"
  echo "  e.g. $0 gehc-poc content/gehc"
  echo "       $0 gehc-poc content/gehc https://www.gehealthcare.com"
  exit 1
fi

SITE_NAME="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTENT_DIR="$SCRIPT_DIR/$2"
SITE_ORIGIN="${3:-}"

if [ ! -d "$CONTENT_DIR" ]; then
  echo "ERROR: Content folder not found: $CONTENT_DIR"
  exit 1
fi
OUTPUT_DIR="$SCRIPT_DIR/documents/$SITE_NAME"
ASSET_LIST="$SCRIPT_DIR/asset-list.json"

# ---------------------------------------------------------------------------
# Load DA_TOKEN from .env
# ---------------------------------------------------------------------------
if [ ! -f "$SCRIPT_DIR/.env" ]; then
  echo "ERROR: .env file not found."
  echo "Create $SCRIPT_DIR/.env with: DA_TOKEN=<your-ims-access-token>"
  exit 1
fi

DA_TOKEN=$(grep '^DA_TOKEN=' "$SCRIPT_DIR/.env" | cut -d'=' -f2-)

if [ -z "$DA_TOKEN" ]; then
  echo "ERROR: DA_TOKEN not found in .env"
  echo "Add this line to $SCRIPT_DIR/.env: DA_TOKEN=<your-ims-access-token>"
  exit 1
fi

# ---------------------------------------------------------------------------
# Generate asset-list.json from image URLs found in content/*.plain.html
# ---------------------------------------------------------------------------
echo "Scanning $CONTENT_DIR for image URLs..."

SITE_ORIGIN="$SITE_ORIGIN" python3 - <<PYEOF
import re, json, glob, os

content_dir = os.environ.get('CONTENT_DIR', '.')
output_path = os.path.join(os.environ.get('SCRIPT_DIR', '.'), 'asset-list.json')

urls = set()
for f in glob.glob(os.path.join(content_dir, '*.plain.html')):
    content = open(f).read()
    found = re.findall(r'https://[^\s"<>]+?\.(?:jpg|jpeg|png|gif|svg|webp|PNG|JPG|JPEG)', content)
    urls.update(found)

data = {"assets": sorted(urls)}
site_origin = os.environ.get('SITE_ORIGIN', '')
if site_origin:
    data['siteOrigin'] = site_origin

with open(output_path, 'w') as out:
    json.dump(data, out, indent=2)

print(f"  Found {len(urls)} unique image assets")
print(f"  Written to: {output_path}")
PYEOF

echo ""

# ---------------------------------------------------------------------------
# Print the full command that will be run
# ---------------------------------------------------------------------------
echo "================================================================"
echo "  Command to be executed:"
echo "================================================================"
echo ""
echo "  aem-import-helper da upload \\"
echo "    --org        vijknair \\"
echo "    --site       $SITE_NAME \\"
echo "    --asset-list $ASSET_LIST \\"
echo "    --da-folder  $CONTENT_DIR \\"
echo "    --output     $OUTPUT_DIR \\"
echo "    --keep       true \\"
echo "    --token      \$DA_TOKEN"
echo ""
echo "  Output folder : $OUTPUT_DIR"
echo "  Pages         : $(ls $CONTENT_DIR/*.plain.html | wc -l | tr -d ' ') plain.html files"
echo "================================================================"
echo ""

# ---------------------------------------------------------------------------
# Confirm before uploading
# ---------------------------------------------------------------------------
read -p "Proceed with upload? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted. No files were uploaded."
  exit 0
fi

mkdir -p "$OUTPUT_DIR"

# ---------------------------------------------------------------------------
# Run the upload
# ---------------------------------------------------------------------------
echo ""
echo "Starting DA upload..."
echo ""

aem-import-helper da upload \
  --org vijknair \
  --site "$SITE_NAME" \
  --asset-list "$ASSET_LIST" \
  --da-folder "$CONTENT_DIR" \
  --output "$OUTPUT_DIR" \
  --keep true \
  --token "$DA_TOKEN"

echo ""
echo "Done. Converted content saved to: $OUTPUT_DIR"
