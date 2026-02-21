FROM bluenviron/mediamtx:latest-ffmpeg

# Instala yq para parsing de YAML
RUN apk add --no-cache yq

# Copia entrypoint customizado
COPY scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
