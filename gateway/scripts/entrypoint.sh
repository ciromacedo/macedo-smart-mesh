#!/bin/sh
# Entrypoint: gera mediamtx.yml a partir do template base + cameras.yml
set -eu

CONFIG_FILE="/config/cameras.yml"
BASE_CONFIG="/mediamtx.base.yml"
FINAL_CONFIG="/mediamtx.yml"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "ERRO: $CONFIG_FILE nao encontrado"
    exit 1
fi

if [ -z "${RELAY_SERVER:-}" ]; then
    echo "ERRO: variavel de ambiente RELAY_SERVER nao definida"
    exit 1
fi

# Copia config base
cp "$BASE_CONFIG" "$FINAL_CONFIG"

# Inicia secao de paths
echo "" >> "$FINAL_CONFIG"
echo "###############################################" >> "$FINAL_CONFIG"
echo "# Paths (gerado automaticamente de cameras.yml)" >> "$FINAL_CONFIG"
echo "paths:" >> "$FINAL_CONFIG"

# Le cada camera e gera path
CAMERA_COUNT=$(yq '.cameras | length' "$CONFIG_FILE")

if [ "$CAMERA_COUNT" -eq 0 ]; then
    echo "AVISO: Nenhuma camera definida em $CONFIG_FILE"
fi

for i in $(seq 0 $((CAMERA_COUNT - 1))); do
    NAME=$(yq ".cameras[$i].name" "$CONFIG_FILE")
    URL=$(yq ".cameras[$i].url" "$CONFIG_FILE")

    echo "Configurando camera: $NAME ($URL)"

    cat >> "$FINAL_CONFIG" <<EOF
  $NAME:
    source: $URL
    sourceOnDemand: false
    runOnReady: >-
      ffmpeg -rtsp_transport tcp -i rtsp://localhost:8554/$NAME
      -c copy -f rtsp -rtsp_transport tcp
      rtsp://$RELAY_SERVER:8554/$NAME
    runOnReadyRestart: true
EOF
done

# Adiciona path generico para streams dinamicos
cat >> "$FINAL_CONFIG" <<EOF
  all_others:
EOF

echo ""
echo "=== Configuracao gerada ==="
cat "$FINAL_CONFIG"
echo "==========================="
echo ""

# Inicia MediaMTX
exec /mediamtx
