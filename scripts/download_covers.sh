#!/usr/bin/env bash
# Descarga portadas de discos desde Wikimedia (URLs originales, no thumb).
# Uso: bash scripts/download_covers.sh
set -euo pipefail

UA="Mozilla/5.0 (compatible; ADLC-Demo/1.0; +educational)"
DEST="apps/web/public/covers"
mkdir -p "$DEST"

declare -A COVERS=(
  ["iron-maiden-number-of-the-beast"]="https://upload.wikimedia.org/wikipedia/en/3/32/IronMaiden_NumberOfBeast.jpg"
  ["iron-maiden-powerslave"]="https://upload.wikimedia.org/wikipedia/en/1/1c/Iron_Maiden_-_Powerslave.jpg"
  ["iron-maiden-seventh-son"]="https://upload.wikimedia.org/wikipedia/en/c/c0/Iron_Maiden_-_Seventh_Son_Of_A_Seventh_Son.jpg"
  ["judas-priest-british-steel"]="https://upload.wikimedia.org/wikipedia/en/9/97/Judas_Priest_British_Steel.jpg"
  ["judas-priest-painkiller"]="https://upload.wikimedia.org/wikipedia/en/1/16/Judaspainkiller.JPG"
  ["metallica-master-of-puppets"]="https://upload.wikimedia.org/wikipedia/en/b/b2/Metallica_-_Master_of_Puppets_cover.jpg"
  ["metallica-ride-the-lightning"]="https://upload.wikimedia.org/wikipedia/en/f/f4/Ridetl.png"
  ["metallica-black-album"]="https://upload.wikimedia.org/wikipedia/en/2/2c/Metallica_-_Metallica_cover.jpg"
  ["led-zeppelin-iv"]="https://upload.wikimedia.org/wikipedia/commons/f/fa/Zeppelin_IV.jpg"
  ["led-zeppelin-physical-graffiti"]="https://upload.wikimedia.org/wikipedia/en/e/e3/Led_Zeppelin_-_Physical_Graffiti.jpg"
  ["black-sabbath-paranoid"]="https://upload.wikimedia.org/wikipedia/en/6/64/Black_Sabbath_-_Paranoid.jpg"
  ["black-sabbath-heaven-and-hell"]="https://upload.wikimedia.org/wikipedia/en/f/f8/Black_Sabbath_Heaven_and_Hell.jpg"
  ["megadeth-rust-in-peace"]="https://upload.wikimedia.org/wikipedia/en/d/dc/Megadeth-RustInPeace.jpg"
  ["slayer-reign-in-blood"]="https://upload.wikimedia.org/wikipedia/en/8/8e/Reign_in_blood.jpg"
)

ok=0
fail=0
for slug in "${!COVERS[@]}"; do
  url="${COVERS[$slug]}"
  ext="${url##*.}"
  ext="${ext,,}"  # lowercase
  out="$DEST/${slug}.${ext}"
  if curl -fsSL -A "$UA" -o "$out" "$url"; then
    echo "ok  $slug -> $out"
    ok=$((ok+1))
  else
    echo "FAIL $slug ($url)"
    fail=$((fail+1))
  fi
done

echo "---"
echo "downloaded: $ok / $((ok+fail))"
