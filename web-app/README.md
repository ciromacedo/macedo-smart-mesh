# Web App - Servidor Central + Frontend

Aplicação web hospedada no servidor com IP fixo. Composta por:

- **Backend API** — Gerência de gateways, câmeras, autenticação
- **MediaMTX** — Recebe streams dos gateways e serve via WebRTC (WHEP) para o browser
- **Frontend** — Interface React com grid multi-câmera e player WebRTC

## Stack

- **MediaMTX** — SFU/relay WebRTC
- **Coturn** — TURN/STUN para NAT traversal
- **Node.js / Go** — Backend API
- **PostgreSQL** — Metadados (câmeras, sites, usuários)
- **React** — Frontend SPA
- **Nginx** — Reverse proxy + TLS

## Estrutura

```
web-app/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   └── src/              # API source code
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── mediamtx/
│   └── mediamtx.yml      # Config do MediaMTX central
├── coturn/
│   └── turnserver.conf
└── nginx/
    └── nginx.conf
```
