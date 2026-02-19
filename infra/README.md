# Infra - Ansible Playbooks

Automação de deploy para todos os componentes do projeto.

## Uso

```bash
# Deploy do servidor central
ansible-playbook -i inventories/production/hosts playbooks/server.yml

# Deploy de um gateway específico
ansible-playbook -i inventories/production/hosts playbooks/gateway.yml --limit site-a

# Deploy de todos os gateways
ansible-playbook -i inventories/production/hosts playbooks/gateway.yml
```

## Estrutura

```
infra/
├── ansible.cfg
├── inventories/
│   └── production/
│       ├── hosts
│       └── group_vars/
│           ├── all.yml
│           ├── server.yml
│           └── gateways.yml
├── playbooks/
│   ├── server.yml
│   └── gateway.yml
└── roles/
    ├── common/          # Docker, ferramentas base
    ├── gateway/         # MediaMTX + ONVIF discovery
    └── server/          # MediaMTX + Coturn + Backend + Frontend
```
