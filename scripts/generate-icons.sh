#!/usr/bin/env bash
set -euo pipefail
export MAGICK_OCL_DEVICE=OFF

MASTER_INPUT="${1:-assets/branding/app-icon-master.png}"
ICON_OFFSET_X="${ICON_OFFSET_X:--8}"
ICON_OFFSET_Y="${ICON_OFFSET_Y:--14}"

if [[ ! -f "$MASTER_INPUT" ]]; then
  echo "Missing source file: $MASTER_INPUT"
  echo "Usage: $0 [path/to/master.png]"
  exit 1
fi

if ! command -v convert >/dev/null 2>&1; then
  echo "ImageMagick 'convert' command not found in PATH"
  exit 1
fi

# Normalize to the canonical 1024x1024 master.
mkdir -p assets/branding
WIDTH="$(identify -format '%w' "$MASTER_INPUT")"
HEIGHT="$(identify -format '%h' "$MASTER_INPUT")"
if (( WIDTH < HEIGHT )); then
  SIDE="$WIDTH"
else
  SIDE="$HEIGHT"
fi
TMP_NORMALIZED="$(mktemp /tmp/app-icon-normalized.XXXXXX.png)"
convert "$MASTER_INPUT" -gravity center -crop "${SIDE}x${SIDE}+0+0" +repage -resize 1024x1024! "$TMP_NORMALIZED"
convert "$TMP_NORMALIZED" -background "#4A3628" -gravity center -extent "1024x1024${ICON_OFFSET_X}${ICON_OFFSET_Y}" assets/branding/app-icon-1024.png
rm -f "$TMP_NORMALIZED"

# iOS AppIcon (single 1024 universal slot used by this project setup).
mkdir -p ios/App/App/Assets.xcassets/AppIcon.appiconset
cp assets/branding/app-icon-1024.png ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png

# Web favicon outputs.
convert assets/branding/app-icon-1024.png -resize 512x512! public/favicon.png
convert assets/branding/app-icon-1024.png -define icon:auto-resize=16,32,48 public/favicon.ico

# Android-ready pack (for future android/ project integration).
ROOT="assets/generated/android-icons"
mkdir -p "$ROOT"

# Legacy launcher icons.
mkdir -p \
  "$ROOT/legacy/mipmap-mdpi" \
  "$ROOT/legacy/mipmap-hdpi" \
  "$ROOT/legacy/mipmap-xhdpi" \
  "$ROOT/legacy/mipmap-xxhdpi" \
  "$ROOT/legacy/mipmap-xxxhdpi"

convert assets/branding/app-icon-1024.png -resize 48x48!   "$ROOT/legacy/mipmap-mdpi/ic_launcher.png"
convert assets/branding/app-icon-1024.png -resize 72x72!   "$ROOT/legacy/mipmap-hdpi/ic_launcher.png"
convert assets/branding/app-icon-1024.png -resize 96x96!   "$ROOT/legacy/mipmap-xhdpi/ic_launcher.png"
convert assets/branding/app-icon-1024.png -resize 144x144! "$ROOT/legacy/mipmap-xxhdpi/ic_launcher.png"
convert assets/branding/app-icon-1024.png -resize 192x192! "$ROOT/legacy/mipmap-xxxhdpi/ic_launcher.png"

# Round legacy icons (same source for now).
cp "$ROOT/legacy/mipmap-mdpi/ic_launcher.png"   "$ROOT/legacy/mipmap-mdpi/ic_launcher_round.png"
cp "$ROOT/legacy/mipmap-hdpi/ic_launcher.png"   "$ROOT/legacy/mipmap-hdpi/ic_launcher_round.png"
cp "$ROOT/legacy/mipmap-xhdpi/ic_launcher.png"  "$ROOT/legacy/mipmap-xhdpi/ic_launcher_round.png"
cp "$ROOT/legacy/mipmap-xxhdpi/ic_launcher.png" "$ROOT/legacy/mipmap-xxhdpi/ic_launcher_round.png"
cp "$ROOT/legacy/mipmap-xxxhdpi/ic_launcher.png" "$ROOT/legacy/mipmap-xxxhdpi/ic_launcher_round.png"

# Adaptive foreground layers.
mkdir -p \
  "$ROOT/adaptive/mipmap-mdpi" \
  "$ROOT/adaptive/mipmap-hdpi" \
  "$ROOT/adaptive/mipmap-xhdpi" \
  "$ROOT/adaptive/mipmap-xxhdpi" \
  "$ROOT/adaptive/mipmap-xxxhdpi"

convert assets/branding/app-icon-1024.png -resize 108x108! "$ROOT/adaptive/mipmap-mdpi/ic_launcher_foreground.png"
convert assets/branding/app-icon-1024.png -resize 162x162! "$ROOT/adaptive/mipmap-hdpi/ic_launcher_foreground.png"
convert assets/branding/app-icon-1024.png -resize 216x216! "$ROOT/adaptive/mipmap-xhdpi/ic_launcher_foreground.png"
convert assets/branding/app-icon-1024.png -resize 324x324! "$ROOT/adaptive/mipmap-xxhdpi/ic_launcher_foreground.png"
convert assets/branding/app-icon-1024.png -resize 432x432! "$ROOT/adaptive/mipmap-xxxhdpi/ic_launcher_foreground.png"

# Adaptive background as solid color (picked from existing brand palette).
for d in mdpi hdpi xhdpi xxhdpi xxxhdpi; do
  case "$d" in
    mdpi) size=108 ;;
    hdpi) size=162 ;;
    xhdpi) size=216 ;;
    xxhdpi) size=324 ;;
    xxxhdpi) size=432 ;;
  esac
  convert -size "${size}x${size}" "xc:#4A3628" "$ROOT/adaptive/mipmap-$d/ic_launcher_background.png"
done

# Integration templates for future android/app/src/main/res.
mkdir -p "$ROOT/templates/mipmap-anydpi-v26"
cat > "$ROOT/templates/mipmap-anydpi-v26/ic_launcher.xml" <<'XML'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
XML

cat > "$ROOT/templates/mipmap-anydpi-v26/ic_launcher_round.xml" <<'XML'
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
XML

echo "Icons generated from: $MASTER_INPUT"
echo "Canonical master: assets/branding/app-icon-1024.png"
echo "Updated: iOS AppIcon + web favicon + Android-ready assets"
