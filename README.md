# WebRTC Gateway - Sistema de Videovigilância Distribuída

Sistema para visualização remota de câmeras de segurança distribuídas em múltiplas redes locais (NAT), utilizando WebRTC para streaming de baixa latência.

## Arquitetura

```
┌─────────────────────────────────────┐
│         REDE LOCAL (Site N)         │
│                                     │
│  [Câmera RTSP] [Câmera ONVIF] ...  │
│         │              │            │
│         └──────┬───────┘            │
│                ▼                    │
│  ┌──────────────────────────┐       │
│  │   Gateway (MediaMTX)    │       │
│  │   + ONVIF discovery     │       │
│  └────────────┬─────────────┘       │
└───────────────┼─────────────────────┘
                │ WHIP (WebRTC HTTP Ingestion)
                ▼
┌─────────────────────────────────────┐
│      SERVIDOR CENTRAL (Cloud)       │
│                                     │
│  ┌──────────────────────────┐       │
│  │  MediaMTX (SFU/Relay)   │       │
│  │  + Coturn (TURN/STUN)   │       │
│  └────────────┬─────────────┘       │
│               │                     │
│  ┌────────────▼─────────────┐       │
│  │  Backend API (Go/Node)  │       │
│  │  + PostgreSQL + Redis   │       │
│  └────────────┬─────────────┘       │
│               │                     │
│  ┌────────────▼─────────────┐       │
│  │  Web App (React)        │       │
│  │  WebRTC Player + Grid   │       │
│  └──────────────────────────┘       │
└─────────────────────────────────────┘
```

## Componentes

| Diretório | Descrição |
|-----------|-----------|
| `gateway/` | Media server local que captura streams das câmeras e encaminha ao servidor central |
| `web-app/` | Aplicação web com backend API e frontend para visualização multi-câmera |
| `infra/` | Playbooks Ansible e Docker Compose para deploy dos componentes |

## Tecnologias Principais

- **MediaMTX** — Proxy RTSP/WebRTC (gateway e servidor)
- **FFmpeg/GStreamer** — Transcodificação quando necessário
- **python-onvif-zeep** — Descoberta e controle de câmeras ONVIF
- **Coturn** — TURN/STUN server para NAT traversal
- **React** — Frontend com WebRTC player nativo
- **Ansible** — Automação de deploy
- **Docker** — Containerização de todos os componentes

## Pré-requisitos

- Docker e Docker Compose
- Ansible >= 2.14
- Node.js >= 20 (para desenvolvimento do frontend)
- Python >= 3.11 (para scripts ONVIF do gateway)

## Quick Start

```bash
# Deploy do servidor central
cd infra/
ansible-playbook -i inventories/production/hosts playbooks/server.yml

# Deploy de um gateway
ansible-playbook -i inventories/production/hosts playbooks/gateway.yml --limit site-a
```

## Licença

Veja [LICENSE](LICENSE).
