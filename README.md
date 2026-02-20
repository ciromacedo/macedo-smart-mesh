# Macedo SmartMesh

Sistema de videovigilancia distribuida para monitoramento remoto de cameras de seguranca em multiplas redes locais (NAT), utilizando WebRTC para streaming de baixa latencia.

## Visao Geral

O **Macedo SmartMesh** permite conectar cameras IP (RTSP/ONVIF) de diferentes locais fisicos a um servidor central na nuvem, com visualizacao em tempo real via navegador. O sistema e composto por tres camadas:

1. **Gateway Local** — Roda na rede onde estao as cameras. Captura streams RTSP e faz relay para o servidor central.
2. **Servidor Central** — Recebe os streams dos gateways e os disponibiliza via WebRTC para os clientes.
3. **Web App** — Interface web com autenticacao JWT e dashboard com grid de cameras ao vivo.

## Arquitetura

```
+-------------------------------------+
|       REDE LOCAL (Site N)           |
|                                     |
|  [Camera RTSP] [Camera ONVIF] ...  |
|         |              |            |
|         +------+-------+            |
|                v                    |
|  +----------------------------+     |
|  |  Gateway (MediaMTX+FFmpeg) |     |
|  |  + ONVIF Discovery         |     |
|  +-------------+--------------+     |
+-----------------|-----------------  +
                  | RTSP relay (ffmpeg -c copy)
                  v
+-------------------------------------+
|     SERVIDOR CENTRAL (Cloud)        |
|                                     |
|  +----------------------------+     |
|  |  MediaMTX (RTSP + WebRTC) |     |
|  +-------------+--------------+     |
|                |                    |
|  +-------------v--------------+     |
|  |  Backend API (Fastify)    |     |
|  |  JWT Auth + Cameras API   |     |
|  +-------------+--------------+     |
|                |                    |
|  +-------------v--------------+     |
|  |  Frontend (React + Vite)  |     |
|  |  WebRTC Player + Grid     |     |
|  +----------------------------+     |
|                                     |
|  +----------------------------+     |
|  |  Caddy (HTTPS + reverse   |     |
|  |  proxy, auto TLS)         |     |
|  +----------------------------+     |
+-------------------------------------+
```

## Estrutura do Projeto

```
macedo-smart-mesh/
|-- gateway/                    # Gateway local (roda na rede das cameras)
|   |-- docker-compose.yml      # Orquestra MediaMTX + ONVIF Discovery
|   |-- mediamtx/
|   |   +-- mediamtx.yml        # Config do MediaMTX (paths, relay, WebRTC)
|   |-- onvif-discovery/
|   |   |-- Dockerfile
|   |   |-- requirements.txt
|   |   +-- src/
|   |       +-- discovery.py    # Descoberta automatica de cameras ONVIF
|   +-- scripts/
|       +-- healthcheck.sh
|
|-- web-app/                    # Aplicacao web (servidor central)
|   |-- backend/
|   |   |-- Dockerfile
|   |   |-- package.json
|   |   +-- src/
|   |       +-- index.js        # API Fastify (auth JWT + cameras)
|   |-- frontend/
|   |   |-- Dockerfile
|   |   |-- index.html
|   |   |-- package.json
|   |   |-- vite.config.js
|   |   +-- src/
|   |       |-- main.jsx
|   |       |-- App.jsx          # Rotas e fluxo de autenticacao
|   |       |-- index.css        # Tema escuro global
|   |       |-- pages/
|   |       |   |-- Login.jsx    # Tela de login
|   |       |   +-- Dashboard.jsx # Dashboard com header e grid
|   |       +-- components/
|   |           |-- CameraGrid.jsx   # Grid responsivo de cameras
|   |           +-- WebRTCPlayer.jsx # Player WebRTC via WHEP
|   |-- mediamtx/
|   |   +-- mediamtx.yml
|   |-- caddy/
|   |   +-- Caddyfile
|   +-- docker-compose.yml
|
+-- infra/                      # Automacao de deploy (Ansible)
    |-- ansible.cfg
    |-- inventories/
    |   +-- production/
    |       |-- hosts
    |       +-- group_vars/
    +-- playbooks/
        |-- server.yml
        +-- gateway.yml
```

## Tecnologias

| Componente | Tecnologia | Versao |
|---|---|---|
| Media Server | [MediaMTX](https://github.com/bluenviron/mediamtx) | v1.12+ |
| Stream Relay | FFmpeg (imagem `mediamtx:latest-ffmpeg`) | 6.x |
| Backend API | [Fastify](https://fastify.dev/) + Node.js | Node 22, Fastify 5 |
| Autenticacao | [@fastify/jwt](https://github.com/fastify/fastify-jwt) + bcryptjs | JWT HS256 |
| Frontend | [React](https://react.dev/) + [Vite](https://vite.dev/) | React 19, Vite 6 |
| Roteamento SPA | [React Router](https://reactrouter.com/) | v7 |
| Streaming (browser) | WebRTC via [WHEP](https://www.ietf.org/archive/id/draft-ietf-wish-whep-02.html) | Nativo |
| Camera Discovery | python-onvif-zeep + WS-Discovery | Python 3.11+ |
| Reverse Proxy + TLS | [Caddy](https://caddyserver.com/) (auto HTTPS via Let's Encrypt) | 2.x |
| Process Manager | PM2 | 5.x |
| Containerizacao | Docker + Docker Compose | v2 |
| Deploy | Ansible | 2.14+ |

## Pre-requisitos

- **Docker** e **Docker Compose** v2
- **Node.js** >= 20 (recomendado 22 LTS)
- **Python** >= 3.11 (para ONVIF Discovery no gateway)
- **Git**

## Quick Start (Desenvolvimento Local)

### 1. Clone o repositorio

```bash
git clone https://github.com/ciromacedo/macedo-smart-mesh.git
cd macedo-smart-mesh
```

### 2. Inicie o gateway

O gateway captura os streams das cameras na rede local.

```bash
cd gateway

# Configure suas cameras no mediamtx/mediamtx.yml (veja secao Configuracao)

docker compose up -d
```

Verifique se o MediaMTX esta recebendo os streams:

```bash
curl http://localhost:9997/v3/paths/list
```

### 3. Inicie o backend

```bash
cd web-app/backend
npm install
npm run dev    # Inicia na porta 3000
```

### 4. Inicie o frontend

```bash
cd web-app/frontend
npm install
npm run dev    # Inicia na porta 5173
```

### 5. Acesse a aplicacao

Abra `http://localhost:5173/login` e faca login com:

- **Email:** `adm@email.com`
- **Senha:** `123456`

O dashboard exibira as cameras ativas do gateway com streaming WebRTC ao vivo.

## Configuracao

### Adicionar uma camera ao gateway

Edite `gateway/mediamtx/mediamtx.yml` e adicione um path:

```yaml
paths:
  minha-camera:
    source: rtsp://usuario:senha@192.168.1.100:554/stream1
    sourceOnDemand: false
```

### Configurar relay para servidor central

Para enviar o stream de uma camera para o servidor na nuvem, adicione `runOnReady`:

```yaml
paths:
  minha-camera:
    source: rtsp://usuario:senha@192.168.1.100:554/stream1
    sourceOnDemand: false
    runOnReady: >
      ffmpeg -rtsp_transport tcp -i rtsp://localhost:8554/minha-camera
      -c copy -f rtsp -rtsp_transport tcp rtsp://SEU_SERVIDOR:8554/minha-camera
    runOnReadyRestart: true
```

O `runOnReady` e executado quando o stream fica disponivel. O `-c copy` garante que nao ha transcodificacao (baixo uso de CPU). O `runOnReadyRestart: true` reinicia automaticamente se o ffmpeg cair.

### Descoberta automatica de cameras ONVIF

O servico `onvif-discovery` descobre cameras automaticamente na rede. Configure as variaveis de ambiente no `docker-compose.yml`:

```yaml
onvif-discovery:
  environment:
    - ONVIF_USER=admin              # Usuario ONVIF das cameras
    - ONVIF_PASSWORD=senha          # Senha ONVIF
    - MEDIAMTX_API=http://host.docker.internal:9997
    - DISCOVERY_INTERVAL=60          # Intervalo entre descobertas (segundos)
    - SCAN_RANGE=192.168.1.1-254     # Range de IPs para scan
```

O servico suporta dois modos de descoberta:
1. **WS-Discovery** (multicast) — padrao, funciona em redes com suporte
2. **Scan por range de IPs** — fallback, util em Docker/WSL2

### Variaveis de ambiente do backend

| Variavel | Padrao | Descricao |
|---|---|---|
| `JWT_SECRET` | `vigiai-super-secret-key-change-in-prod` | Chave secreta para assinatura dos tokens JWT |
| `MEDIAMTX_API` | `http://localhost:9997` | URL da API do MediaMTX |
| `PORT` | `3000` | Porta do servidor backend |

## API Reference

### Autenticacao

#### `POST /api/auth/login`

Autentica o usuario e retorna um token JWT.

**Request:**
```json
{
  "email": "adm@email.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (401):**
```json
{
  "error": "Credenciais invalidas"
}
```

#### `GET /api/auth/me`

Retorna os dados do usuario autenticado.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "1",
  "email": "adm@email.com",
  "name": "Administrador"
}
```

### Cameras

#### `GET /api/cameras`

Retorna a lista de cameras ativas no MediaMTX.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "cameras": [
    {
      "id": "sonoff-sala",
      "name": "sonoff-sala",
      "path": "sonoff-sala",
      "ready": true,
      "sourceType": "rtspSource"
    }
  ]
}
```

#### `GET /api/health`

Health check (nao requer autenticacao).

**Response (200):**
```json
{
  "status": "ok"
}
```

## Deploy em Producao

### Servidor Central (exemplo com Ubuntu 24.04)

```bash
# 1. Instalar dependencias
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
npm install -g pm2

# 1b. Instalar Caddy
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy

# 2. Clonar o repositorio
cd /opt
git clone https://github.com/ciromacedo/macedo-smart-mesh.git
cd macedo-smart-mesh

# 3. Instalar MediaMTX
curl -fsSL https://github.com/bluenviron/mediamtx/releases/download/v1.12.2/mediamtx_v1.12.2_linux_amd64.tar.gz | tar xz -C /usr/local/bin/ mediamtx

# 4. Configurar MediaMTX como servico
cat > /etc/systemd/system/mediamtx.service << 'EOF'
[Unit]
Description=MediaMTX RTSP/WebRTC Server
After=network.target

[Service]
ExecStart=/usr/local/bin/mediamtx /etc/mediamtx/mediamtx.yml
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

mkdir -p /etc/mediamtx
cp web-app/mediamtx/mediamtx.yml /etc/mediamtx/
systemctl enable --now mediamtx

# 5. Backend
cd web-app/backend
npm install
JWT_SECRET="sua-chave-secreta" MEDIAMTX_API="http://127.0.0.1:9997" \
  pm2 start src/index.js --name smartmesh-api
pm2 save && pm2 startup

# 6. Frontend (build de producao)
cd ../frontend
npm install
npx vite build

# 7. Caddy (HTTPS automatico + reverse proxy)
cat > /etc/caddy/Caddyfile << 'CADDY'
smartmesh.drmacedo.tech {
    root * /opt/web-rtc-gateway/web-app/frontend/dist
    file_server

    try_files {path} /index.html

    handle /api/* {
        reverse_proxy localhost:3000
    }

    handle /webrtc/* {
        uri strip_prefix /webrtc
        reverse_proxy localhost:8889
    }
}
CADDY

ufw allow 443/tcp
systemctl enable --now caddy
# Caddy obtem certificado SSL automaticamente via Let's Encrypt
```

### Portas necessarias no servidor

| Porta | Protocolo | Servico |
|---|---|---|
| 80 | TCP | Caddy (HTTP → redireciona para HTTPS) |
| 443 | TCP | Caddy (HTTPS, TLS automatico via Let's Encrypt) |
| 8554 | TCP | MediaMTX RTSP (recebe streams dos gateways) |
| 8889 | TCP | MediaMTX WebRTC HTTP |
| 8189 | UDP | MediaMTX WebRTC ICE |

### Gateway (Raspberry Pi, PC, VM)

```bash
git clone https://github.com/ciromacedo/macedo-smart-mesh.git
cd macedo-smart-mesh/gateway

# Edite mediamtx/mediamtx.yml com suas cameras e IP do servidor
# Edite docker-compose.yml com credenciais ONVIF se necessario

docker compose up -d
```

## Fluxo de Dados

```
Camera RTSP (rede local)
    |
    v
Gateway MediaMTX (captura via RTSP)
    |
    | ffmpeg -c copy (relay sem transcodificacao)
    v
Servidor MediaMTX (recebe via RTSP, porta 8554)
    |
    |-- API /v3/paths/list --> Backend Fastify --> GET /api/cameras
    |
    +-- WebRTC WHEP --> Caddy /webrtc/* --> Browser (Dashboard)
```

## Frontend

### Tema Visual

O frontend utiliza um tema escuro com a seguinte paleta:

| Elemento | Cor |
|---|---|
| Background principal | `#1a1a2e` |
| Background secundario | `#16213e` |
| Background cards | `#0f3460` |
| Accent/Primary | `#e94560` |
| Accent hover | `#ff6b6b` |
| Texto principal | `white` |
| Texto secundario | `#a0a0a0` |
| Fonte | Segoe UI, Tahoma, Geneva, Verdana, sans-serif |

### Layout do Dashboard

- Header fixo (sticky) com logo, nome do usuario e botao de logout
- Grid responsivo de cameras:
  - **Desktop (>1200px):** 4 colunas
  - **Tablet (768-1200px):** 3 colunas
  - **Mobile (480-768px):** 2 colunas
  - **Mobile pequeno (<480px):** 1 coluna
- Cards com indicador de status (verde = online, cinza = offline)
- Player WebRTC com aspect ratio 16:9
- Estado offline com icone quando a camera nao tem stream

## Troubleshooting

### O dashboard mostra "Nenhuma camera encontrada"

1. Verifique se o MediaMTX esta rodando e recebendo streams:
   ```bash
   curl http://localhost:9997/v3/paths/list
   ```
2. Verifique se o backend consegue acessar a API do MediaMTX:
   ```bash
   curl http://localhost:3000/api/health
   ```

### O ffmpeg relay nao funciona

1. Verifique se a porta 8554 do servidor esta acessivel:
   ```bash
   docker exec gateway-mediamtx ffmpeg -i rtsp://SEU_SERVIDOR:8554/test -c copy -f null - 2>&1
   ```
2. Verifique os logs do container:
   ```bash
   docker logs gateway-mediamtx
   ```

### Camera ONVIF nao e descoberta

1. Verifique se o `SCAN_RANGE` esta configurado corretamente
2. Teste conectividade ONVIF manualmente:
   ```bash
   docker exec gateway-onvif python3 -c "
   from onvif import ONVIFCamera
   cam = ONVIFCamera('192.168.1.100', 80, 'admin', 'senha')
   print(cam.devicemgmt.GetDeviceInformation())
   "
   ```

### WebRTC nao conecta no browser

1. Verifique se o Caddy esta fazendo proxy correto para `/webrtc/`
2. Verifique se o MediaMTX WebRTC esta ouvindo na porta 8889
3. Em redes restritivas, pode ser necessario configurar um servidor TURN (Coturn)

## Roadmap

- [x] HTTPS com Let's Encrypt (Caddy, auto TLS)
- [ ] Autenticacao com banco de dados (PostgreSQL)
- [ ] Gerenciamento de usuarios (CRUD)
- [ ] Gravacao de video (recording)
- [ ] Alertas e notificacoes
- [ ] Microservico de CV no Gateway (Raspberry Pi) — YOLOv8n para deteccao de pessoas/veiculos em tempo real. Cada gateway processa localmente e envia apenas metadados (bounding boxes + labels) ao servidor central via API. Distribuicao round-robin entre cameras para otimizar uso de CPU/GPU no Pi.
- [ ] Suporte a PTZ (Pan-Tilt-Zoom) via ONVIF
- [ ] Configuracao de cameras via interface web
- [ ] Deploy automatizado com Ansible
- [ ] App mobile (React Native)

## Licenca

Veja [LICENSE](LICENSE).
