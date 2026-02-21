#!/bin/sh
# Entrypoint: valida API key, gera mediamtx.yml a partir do template base + cameras.yml
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

if [ -z "${API_KEY:-}" ]; then
    echo "ERRO: variavel de ambiente API_KEY nao definida"
    exit 1
fi

# Valida API key no backend antes de subir
echo "Validando API key no servidor..."
AUTH_RESPONSE=$(wget -qO- \
    --post-data="{\"api_key\":\"$API_KEY\"}" \
    --header="Content-Type: application/json" \
    "http://$RELAY_SERVER:3000/api/gateways/auth" 2>/dev/null) || true

if echo "$AUTH_RESPONSE" | grep -q '"valid":true'; then
    GATEWAY_NAME=$(echo "$AUTH_RESPONSE" | sed 's/.*"name":"\([^"]*\)".*/\1/')
    echo "Gateway autenticado: $GATEWAY_NAME"
else
    echo "ERRO: API key invalida ou gateway inativo. Resposta: $AUTH_RESPONSE"
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
      rtsp://gateway:$API_KEY@$RELAY_SERVER:8554/$NAME
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
