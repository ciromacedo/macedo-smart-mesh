# Gateway - Media Server Local

Componente que executa na rede local junto às câmeras. Responsável por:

- Descobrir câmeras via ONVIF
- Capturar streams RTSP
- Encaminhar streams ao servidor central via WHIP (WebRTC)
- Monitorar saúde das conexões e reconectar automaticamente

## Stack

- **MediaMTX** — Proxy RTSP → WebRTC
- **python-onvif-zeep** — Descoberta e configuração ONVIF
- **Docker Compose** — Orquestração local

## Estrutura

```
gateway/
├── docker-compose.yml      # Orquestração dos containers
├── mediamtx/
│   └── mediamtx.yml        # Configuração do MediaMTX
├── onvif-discovery/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── src/
│       └── discovery.py    # Script de descoberta ONVIF
└── scripts/
    └── healthcheck.sh      # Verificação de saúde dos streams
```
