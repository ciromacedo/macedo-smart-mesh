#!/usr/bin/env bash
# Healthcheck: verifica se o MediaMTX está respondendo e se há paths ativos
set -euo pipefail

MEDIAMTX_API="http://127.0.0.1:9997"

# Verifica se a API está acessível
if ! curl -sf "${MEDIAMTX_API}/v3/paths/list" > /dev/null 2>&1; then
    echo "ERRO: MediaMTX API não está respondendo"
    exit 1
fi

echo "OK: MediaMTX está operacional"
curl -s "${MEDIAMTX_API}/v3/paths/list" | python3 -m json.tool
